// @ts-expect-error - ignore
const { KeyManager } = await import('@holo-host/cryptolib');
import { AUTHENTICATED_APPS_LIST, SESSION } from '@shared/const';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@shared/helpers';
import { storageService } from '@shared/services';
import {
	AuthenticatedAppsListSchema,
	type MessageToSignWithHapp,
	SuccessMessageSignedSchema
} from '@shared/types';

export const signMessageLogic = async ({ message, happId }: MessageToSignWithHapp) => {
	const authenticatedAppsListData = await storageService.getWithoutCallback({
		key: AUTHENTICATED_APPS_LIST,
		area: SESSION
	});

	const parsedAuthenticatedAppsListData =
		AuthenticatedAppsListSchema.safeParse(authenticatedAppsListData);

	if (!parsedAuthenticatedAppsListData.success) {
		throw new Error('Failed to parse authenticated apps list data');
	}

	const key = parsedAuthenticatedAppsListData.data[happId];

	console.log('key', key);

	const uint8ArrayKey = base64ToUint8Array(key);

	console.log('uint8ArrayKey', uint8ArrayKey);

	const keyManager = new KeyManager(uint8ArrayKey);

	console.log('keyManager', keyManager);

	const uint8ArrayMessage = base64ToUint8Array(message);

	const signedMessage = keyManager.sign(uint8ArrayMessage);

	const validatedSchema = SuccessMessageSignedSchema.safeParse({
		signature: uint8ArrayToBase64(signedMessage)
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid message');
	}

	return validatedSchema.data;
};
