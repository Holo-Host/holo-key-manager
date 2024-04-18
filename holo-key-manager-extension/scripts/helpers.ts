/* eslint-disable simple-import-sort/imports */
import {
	LockedSeedCipherPwHash,
	parseSecret,
	seedBundleReady,
	UnlockedSeedBundle
	// @ts-expect-error no types for hcSeedBundle
} from 'hcSeedBundle';
import { AUTHENTICATED_APPS_LIST, SESSION } from '@shared/const';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@shared/helpers';
import { getSessionKey, storageService } from '@shared/services';
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

	const index = parsedAuthenticatedAppsListData.data[happId];
	const sessionKey = await getSessionKey();

	if (!sessionKey.success) {
		throw new Error('Session data not found');
	}

	await seedBundleReady;

	const cipherList = UnlockedSeedBundle.fromLocked(base64ToUint8Array(sessionKey.data));

	if (!(cipherList[0] instanceof LockedSeedCipherPwHash)) {
		throw new Error('Expecting PwHash');
	}

	const pw = new TextEncoder().encode(SESSION);
	const keyUnlocked = cipherList[0].unlock(parseSecret(pw));

	const appKey = keyUnlocked.derive(index);

	const signedMessage = appKey.sign(message);

	keyUnlocked.zero();
	appKey.zero();

	const validatedSchema = SuccessMessageSignedSchema.safeParse({
		signature: uint8ArrayToBase64(signedMessage)
	});

	if (!validatedSchema.success) {
		throw new Error('Invalid message');
	}

	return validatedSchema.data;
};
