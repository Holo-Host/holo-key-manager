import {
	LockedSeedCipherPwHash,
	parseSecret,
	seedBundleReady,
	UnlockedSeedBundle
} from '@holochain/hc-seed-bundle';
import { AUTHENTICATED_APPS_LIST, DEEP_KEY_AGENT_OFFSET, SESSION } from '@shared/const';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@shared/helpers';
import { getDeviceKey, storageService } from '@shared/services';
import {
	AuthenticatedAppsListSchema,
	type SignMessage,
	SuccessMessageSignedSchema
} from '@shared/types';

export const signMessageLogic = async ({ message, happId, session }: SignMessage) => {
	const encryptedDeviceKey = await getDeviceKey();

	const authenticatedAppsListData = await storageService.getWithoutCallback({
		key: AUTHENTICATED_APPS_LIST,
		area: SESSION
	});

	const parsedAuthenticatedAppsListData =
		AuthenticatedAppsListSchema.safeParse(authenticatedAppsListData);

	if (!parsedAuthenticatedAppsListData.success || !session) {
		throw new Error('Authentication failed: Unable to parse apps list or session missing');
	}

	const { index } = parsedAuthenticatedAppsListData.data[happId];

	await seedBundleReady;

	const cipherList = UnlockedSeedBundle.fromLocked(base64ToUint8Array(encryptedDeviceKey));

	if (!(cipherList[0] instanceof LockedSeedCipherPwHash)) {
		throw new Error('Expecting PwHash');
	}

	const pw = new TextEncoder().encode(session);
	const keyUnlocked = cipherList[0].unlock(parseSecret(pw));

	const appKey = keyUnlocked.derive(index + DEEP_KEY_AGENT_OFFSET);

	const uIntArrayMessage = base64ToUint8Array(message);

	const signedMessage = appKey.sign(uIntArrayMessage);

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
