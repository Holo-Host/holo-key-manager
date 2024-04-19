import type { QueryClient } from '@tanstack/svelte-query';

import { unlockKey } from '$services';
import {
	APPS_LIST,
	AUTHENTICATED_APPS_LIST,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	LOCAL,
	PASSWORD,
	SESSION
} from '$shared/const';
import { parseMessageSchema, uint8ArrayToBase64 } from '$shared/helpers';
import { getSessionKey, sendMessage, storageService } from '$shared/services';
import {
	AppsListSchema,
	AuthenticatedAppsListSchema,
	HashSaltSchema,
	keyAsAStringSchema,
	type Message,
	PubKeySchema
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

export const deriveSignKeyAndPubKey = async (newIndex: number) => {
	const sessionKey = await getSessionKey();

	if (!sessionKey.success) {
		throw new Error('Session data not found');
	}

	const keyUnlocked = await unlockKey(sessionKey.data, SESSION);

	const { publicKey, key } = keyUnlocked.deriveAppKey(newIndex);

	keyUnlocked.zero();

	const validatedPubKeySchema = PubKeySchema.safeParse({
		pubKey: uint8ArrayToBase64(publicKey)
	});

	const validatedKeySchema = keyAsAStringSchema.safeParse(uint8ArrayToBase64(key));

	if (!validatedPubKeySchema.success || !validatedKeySchema.success) {
		throw new Error('Invalid key');
	}

	return {
		pubKeyObject: validatedPubKeySchema.data,
		key: validatedKeySchema.data
	};
};
