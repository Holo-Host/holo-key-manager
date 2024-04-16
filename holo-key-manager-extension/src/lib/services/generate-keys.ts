// eslint-disable-next-line
// @ts-nocheck
import * as hcSeedBundle from 'hcSeedBundle';

import { base64ToUint8Array, uint8ArrayToBase64 } from '$shared/helpers';
import type { GeneratedKeys } from '$types';

const lock = (root: never, password: string) =>
	root.lock([
		new hcSeedBundle.SeedCipherPwHash(
			hcSeedBundle.parseSecret(new TextEncoder().encode(password)),
			'minimum'
		)
	]);

const deriveAndLock = (
	master: never,
	derivationPath: number,
	bundleType: string,
	passphrase: string
) => {
	const root = master.derive(derivationPath, {
		bundle_type: bundleType
	});
	root.setAppData({
		device_number: derivationPath,
		generate_by: 'keymanager-v1.0'
	});

	return lock(root, passphrase);
};

export async function generateKeys(
	passphrase: string,
	extensionPassword: string
): Promise<GeneratedKeys> {
	await hcSeedBundle.seedBundleReady;

	const master = hcSeedBundle.UnlockedSeedBundle.newRandom({
		bundle_type: 'master'
	});
	master.setAppData({
		generate_by: 'keymanager-v1.0'
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

export const lockKey = async (key: unknown, password: string) => {
	await hcSeedBundle.seedBundleReady;

	const pw = new TextEncoder().encode(password);
	const encodedBytes = key.lock([
		new hcSeedBundle.SeedCipherPwHash(hcSeedBundle.parseSecret(pw), 'minimum')
	]);

	key.zero();

	return uint8ArrayToBase64(encodedBytes);
};

export const unlockKey = async (encodedBytesString: string, password: string) => {
	await hcSeedBundle.seedBundleReady;

	const cipherList = hcSeedBundle.UnlockedSeedBundle.fromLocked(
		base64ToUint8Array(encodedBytesString)
	);

	if (!(cipherList[0] instanceof hcSeedBundle.LockedSeedCipherPwHash)) {
		throw new Error('Expecting PwHash');
	}

	const pw = new TextEncoder().encode(password);
	const key = cipherList[0].unlock(hcSeedBundle.parseSecret(pw));

	return key;
};
