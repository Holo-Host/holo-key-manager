import type { QueryClient } from '@tanstack/svelte-query';

import { unlockKey } from '$services';
import {
	AUTHENTICATED_APPS_LIST,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	LOCAL,
	PASSWORD,
	SESSION
} from '$shared/const';
import { parseMessageSchema, uint8ArrayToBase64 } from '$shared/helpers';
import { getSessionKey, sendMessage, storageService } from '$shared/services';
import {
	AuthenticatedAppsListSchema,
	HashSaltSchema,
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
		pubKey: uint8ArrayToBase64(signPubKey)
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid key');
	}

	return validatedSchema.data;
};
