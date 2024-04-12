import { encodeHashToBase64 } from '@holochain/client';
import type { QueryClient } from '@tanstack/svelte-query';

import { unlockKey } from '$services';
import {
	APPS_LIST,
	AUTHENTICATED_APPS_LIST,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_STORAGE_KEY
} from '$shared/const';
import { parseMessageSchema } from '$shared/helpers';
import { sendMessage, storageService } from '$shared/services';
import {
	AppsListSchema,
	AuthenticatedAppsListSchema,
	HashSaltSchema,
	type Message,
	PubKeySchema,
	SessionStateSchema,
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

export const getSessionKey = async () => {
	const data = await storageService.getWithoutCallback({
		key: SESSION_STORAGE_KEY,
		area: SESSION
	});
	return SessionStateSchema.safeParse(data);
};

export const fetchAndParseAppsList = async () => {
	const appsListData = await storageService.getWithoutCallback({
		key: APPS_LIST,
		area: LOCAL
	});

	const parsedAppsListData = AppsListSchema.safeParse(appsListData);

	return parsedAppsListData.success ? parsedAppsListData.data : [];
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

export const sendMessageAndHandleResponse = async (message: Message) => {
	const response = await sendMessage(message);

	const parsedResponse = parseMessageSchema(response);

	if (parsedResponse.data.action !== BACKGROUND_SCRIPT_RECEIVED_DATA)
		throw new Error('Error sending data to webapp');
};

export const deriveSignPubKey = async (newIndex: number) => {
	const sessionKey = await getSessionKey();

	if (!sessionKey.success) {
		throw new Error('Session data not found');
	}

	const keyUnlocked = await unlockKey(sessionKey.data, SESSION);
	const { signPubKey } = keyUnlocked.derive(newIndex);
	keyUnlocked.zero();

	const validatedSchema = PubKeySchema.safeParse({
		pubKey: signPubKey
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid key');
	}

	return validatedSchema.data;
};

export const signMessage = async (message: string, index: number) => {
	const sessionKey = await getSessionKey();

	if (!sessionKey.success) {
		throw new Error('Session data not found');
	}

	const keyUnlocked = await unlockKey(sessionKey.data, SESSION);
	const appKey = keyUnlocked.derive(index);

	const signedMessage = appKey.sign(message);

	keyUnlocked.zero();
	appKey.zero();

	const encodedMessage = encodeHashToBase64(signedMessage);

	const validatedSchema = SuccessMessageSignedSchema.safeParse({
		message: encodedMessage
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid message');
	}

	return validatedSchema.data;
};
