import {
	LockedSeedCipherPwHash,
	parseSecret,
	seedBundleReady,
	SeedCipherPwHash,
	UnlockedSeedBundle
} from '@holochain/hc-seed-bundle';

import { base64ToUint8Array, uint8ArrayToBase64 } from '$shared/helpers';
import type { GeneratedKeys } from '$types';

const lock = (root: UnlockedSeedBundle, password: string) =>
	root.lock([new SeedCipherPwHash(parseSecret(new TextEncoder().encode(password)), 'minimum')]);

const deriveAndLock = (
	master: UnlockedSeedBundle,
	derivationPath: number,
	bundleType: string,
	passphrase: string
) => {
	const root = master.derive(derivationPath, {
		bundle_type: bundleType
	});

	const encodedBytes = lock(root, passphrase);
	root.zero();

	return encodedBytes;
};

export async function generateKeys(
	passphrase: string,
	extensionPassword: string
): Promise<GeneratedKeys> {
	await seedBundleReady;

	const master = UnlockedSeedBundle.newRandom({
		bundle_type: 'master'
	});

	const encodedMasterBytes: Uint8Array = lock(master, passphrase);
	const encodedRevocationBytes = deriveAndLock(master, 0, 'revocationRoot', passphrase);
	const encodedDeviceBytes = deriveAndLock(master, 1, 'deviceRoot', passphrase);
	const encodedDeviceBytesWithExtensionPassword = deriveAndLock(
		master,
		1,
		'deviceRoot',
		extensionPassword
	);

	master.zero();

	return {
		encodedMaster: encodedMasterBytes,
		encodedDeviceWithExtensionPassword: uint8ArrayToBase64(encodedDeviceBytesWithExtensionPassword),
		encodedDevice: encodedDeviceBytes,
		encodedRevocation: encodedRevocationBytes
	};
}

export const lockKey = async (key: UnlockedSeedBundle, password: string) => {
	await seedBundleReady;

	const pw = new TextEncoder().encode(password);
	const encodedBytes = key.lock([new SeedCipherPwHash(parseSecret(pw), 'moderate')]);

	key.zero();

	return uint8ArrayToBase64(encodedBytes);
};

export const unlockKey = async (encodedBytesString: string, password: string) => {
	await seedBundleReady;

	const cipherList = UnlockedSeedBundle.fromLocked(base64ToUint8Array(encodedBytesString));

	if (!(cipherList[0] instanceof LockedSeedCipherPwHash)) {
		throw new Error('Expecting PwHash');
	}

	const pw = new TextEncoder().encode(password);
	const key = cipherList[0].unlock(parseSecret(pw));

	return key;
};
