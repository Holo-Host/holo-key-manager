import { encodeHashToBase64 } from '@holochain/client';
import { encode } from '@msgpack/msgpack';
import type { QueryClient } from '@tanstack/svelte-query';

import { DEEP_KEY_INDEX } from '$const';
import { createGetKeysObjectParams, getKeys, unlockKey } from '$services';
import {
	AUTHENTICATED_APPS_LIST,
	EXTENSION_SESSION_INFO,
	GET_EXTENSION_SESSION,
	KEY_INDEX,
	LOCAL,
	PASSWORD,
	SENDER_EXTENSION,
	SESSION
} from '$shared/const';
import { parseMessageSchema, uint8ArrayToBase64 } from '$shared/helpers';
import { createMessageWithId, getDeviceKey, sendMessage, storageService } from '$shared/services';
import {
	AuthenticatedAppsListSchema,
	HashSaltSchema,
	type PubKey,
	PubKeySchema,
	SuccessMessageSignedSchema
} from '$shared/types';

import { extendUint8Array } from './encryption';

export const handleSuccess = (queryClient: QueryClient, queryKey: string[]) => () =>
	queryClient.invalidateQueries({ queryKey });

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({
		key: PASSWORD,
		area: LOCAL
	});
	return HashSaltSchema.safeParse(data);
};

export const fetchKeys = async () => {
	const { pubKey } = await getDeepKeyAgentPubKeyWithExternalEncoding();
	const getKeysParams = createGetKeysObjectParams({
		deepkeyAgent: pubKey,
		timestamp: Date.now()
	});
	const signedMessage = await signWithDeepKeyAgent(getKeysParams);

	return await getKeys(getKeysParams, signedMessage.signature);
};

export const fetchAuthenticatedAppsList = async (happId?: string) => {
	const authenticatedAppsListData = await storageService.getWithoutCallback({
		key: AUTHENTICATED_APPS_LIST,
		area: SESSION
	});

	const parsedAuthenticatedAppsListData =
		AuthenticatedAppsListSchema.safeParse(authenticatedAppsListData);

	if (!parsedAuthenticatedAppsListData.success) {
		return {};
	}

	if (happId && !(happId in parsedAuthenticatedAppsListData.data)) {
		throw new Error('Not authenticated');
	}

	return parsedAuthenticatedAppsListData.data;
};

export const getExtensionSession = async () => {
	const messageWithId = createMessageWithId({
		sender: SENDER_EXTENSION,
		action: GET_EXTENSION_SESSION
	});

	const response = await sendMessage(messageWithId);

	const parsedResponse = parseMessageSchema(response);

	if (!parsedResponse.success || parsedResponse.data.action !== EXTENSION_SESSION_INFO) {
		throw new Error('Error getting extension session');
	}

	return parsedResponse.data.payload;
};

const validatePubKey = (signPubKey: Uint8Array, encoder: (key: Uint8Array) => string) => {
	const validatedSchema = PubKeySchema.safeParse({
		pubKey: encoder(signPubKey)
	});
	if (!validatedSchema.success) {
		throw new Error('Invalid key');
	}
	return validatedSchema.data;
};

const validatePubKeyWithBase64 = (signPubKey: Uint8Array) =>
	validatePubKey(signPubKey, uint8ArrayToBase64);
const validatePubKeyWithExternalEncoding = (signPubKey: Uint8Array) => {
	const extendedSignPubKey = extendUint8Array(signPubKey);
	return validatePubKey(extendedSignPubKey, encodeHashToBase64);
};

const deriveAppKey = async (index: number) => {
	const session = await getExtensionSession();
	if (!session) {
		throw new Error('Session data not found');
	}
	const encryptedDeviceKey = await getDeviceKey();
	const keyUnlocked = await unlockKey(encryptedDeviceKey, session);
	const agent = keyUnlocked.derive(index);
	keyUnlocked.zero();
	const appKey = agent.derive(KEY_INDEX);
	agent.zero();
	return appKey;
};

export const signWithDeepKeyAgent = async (payload: object) => {
	const deepKeyAgent = await deriveAppKey(DEEP_KEY_INDEX);
	const encodedPayload = encode(payload, { useBigInt64: true });

	const signature = deepKeyAgent.sign(encodedPayload);
	deepKeyAgent.zero();

	const validatedSchema = SuccessMessageSignedSchema.safeParse({
		signature: encodeHashToBase64(signature)
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid message');
	}

	return validatedSchema.data;
};

export const getDeepKeyAgentPubKeyWithExternalEncoding = async () => {
	const appKey = await deriveAppKey(DEEP_KEY_INDEX);
	const validatedPubKey = validatePubKeyWithExternalEncoding(appKey.signPubKey);
	appKey.zero();
	return validatedPubKey;
};

const deriveSignPubKeyBase = async (index: number, validator: (key: Uint8Array) => PubKey) => {
	const appKey = await deriveAppKey(index);
	const validatedPubKey = validator(appKey.signPubKey);
	appKey.zero();
	return validatedPubKey;
};

export const deriveSignPubKey = async (index: number) =>
	deriveSignPubKeyBase(index, validatePubKeyWithBase64);
export const deriveSignPubKeyWithExternalEncoding = async (index: number) =>
	deriveSignPubKeyBase(index, validatePubKeyWithExternalEncoding);
