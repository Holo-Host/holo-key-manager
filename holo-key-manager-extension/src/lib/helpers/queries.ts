import { encodeHashToBase64 } from '@holochain/client';
import { encode } from '@msgpack/msgpack';
import type { QueryClient } from '@tanstack/svelte-query';

import { unlockKey } from '$services';
import {
	AUTHENTICATED_APPS_LIST,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	EXTENSION_SESSION_INFO,
	GET_EXTENSION_SESSION,
	LOCAL,
	PASSWORD,
	SENDER_EXTENSION,
	SESSION
} from '$shared/const';
import { parseMessageSchema, uint8ArrayToBase64 } from '$shared/helpers';
import {
	createMessageWithId,
	getDeviceKey,
	responseToMessage,
	sendMessage,
	storageService
} from '$shared/services';
import {
	AuthenticatedAppsListSchema,
	HashSaltSchema,
	type Message,
	PubKeySchema,
	SuccessMessageSignedSchema
} from '$shared/types';

export const handleSuccess = (queryClient: QueryClient, queryKey: string[]) => () =>
	queryClient.invalidateQueries({ queryKey });

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({
		key: PASSWORD,
		area: LOCAL
	});
	return HashSaltSchema.safeParse(data);
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

export const sendMessageAndHandleResponse = async (message: Message, id?: string) => {
	const messageWithId = id ? responseToMessage(message, id) : createMessageWithId(message);

	const response = await sendMessage(messageWithId);

	const parsedResponse = parseMessageSchema(response);

	if (parsedResponse.data.action !== BACKGROUND_SCRIPT_RECEIVED_DATA)
		throw new Error('Error sending data to webapp');
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

const getSessionAndKey = async () => {
	const session = await getExtensionSession();
	if (!session) {
		throw new Error('Session data not found');
	}
	const encryptedDeviceKey = await getDeviceKey();
	const keyUnlocked = await unlockKey(encryptedDeviceKey, session);
	return keyUnlocked;
};

const validatePubKey = (signPubKey: Uint8Array) => {
	const validatedSchema = PubKeySchema.safeParse({
		pubKey: uint8ArrayToBase64(signPubKey)
	});
	if (!validatedSchema.success) {
		throw new Error('Invalid key');
	}
	return validatedSchema.data;
};

export const getDevicePubKey = async () => {
	const keyUnlocked = await getSessionAndKey();
	const { signPubKey } = keyUnlocked;
	keyUnlocked.zero();
	return validatePubKey(signPubKey);
};

export const signWithDevicePubKey = async (payload: object) => {
	const keyUnlocked = await getSessionAndKey();

	const encodedPayload = encode(payload, { useBigInt64: true });
	const signature = keyUnlocked.sign(encodedPayload);

	keyUnlocked.zero();
	console.log(signature);
	const validatedSchema = SuccessMessageSignedSchema.safeParse({
		signature: encodeHashToBase64(signature)
	});
	console.log(encodeHashToBase64(signature));

	if (!validatedSchema.success) {
		throw new Error('Invalid message');
	}

	return validatedSchema.data;
};

export const deriveSignPubKey = async (newIndex: number) => {
	const keyUnlocked = await getSessionAndKey();
	const { signPubKey } = keyUnlocked.derive(newIndex);
	keyUnlocked.zero();
	return validatePubKey(signPubKey);
};
