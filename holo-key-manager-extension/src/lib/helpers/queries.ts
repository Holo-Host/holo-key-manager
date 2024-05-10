import type { QueryClient } from '@tanstack/svelte-query';

import { unlockKey } from '$services';
import {
	AUTHENTICATED_APPS_LIST,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	DEVICE_KEY,
	EXTENSION_SESSION_INFO,
	GET_EXTENSION_SESSION,
	LOCAL,
	PASSWORD,
	SENDER_EXTENSION,
	SESSION
} from '$shared/const';
import { parseMessageSchema, uint8ArrayToBase64 } from '$shared/helpers';
import { sendMessage, storageService } from '$shared/services';
import {
	AuthenticatedAppsListSchema,
	EncryptedDeviceKeySchema,
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

export const getExtensionSession = async () => {
	const response = await sendMessage({
		sender: SENDER_EXTENSION,
		action: GET_EXTENSION_SESSION
	});

	const parsedResponse = parseMessageSchema(response);

	if (!parsedResponse.success || parsedResponse.data.action !== EXTENSION_SESSION_INFO) {
		throw new Error('Error getting extension session');
	}

	return parsedResponse.data.payload;
};

export const getDeviceKey = async () => {
	const deviceKey = await storageService.getWithoutCallback({
		key: DEVICE_KEY,
		area: LOCAL
	});

	const parsedDeviceKey = EncryptedDeviceKeySchema.safeParse(deviceKey);

	if (!parsedDeviceKey.success) {
		throw new Error('Invalid device key');
	}

	return parsedDeviceKey.data;
};

export const deriveSignPubKey = async (newIndex: number) => {
	const session = await getExtensionSession();

	if (!session) {
		throw new Error('Session data not found');
	}

	const encryptedDeviceKey = await getDeviceKey();

	const keyUnlocked = await unlockKey(encryptedDeviceKey, session);

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
