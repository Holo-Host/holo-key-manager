// @ts-nocheck
import * as hcSeedBundle from 'hcSeedBundle';

export async function generateKeys(passphrase: string) {
	await hcSeedBundle.seedBundleReady;

	const pw = new TextEncoder().encode(passphrase);

	const master = hcSeedBundle.UnlockedSeedBundle.newRandom({
		bundle_type: 'master'
	});
	master.setAppData({
		generate_by: 'keymanager-v1.0'
	});
	const encodedMasterBytes = master.lock([
		new hcSeedBundle.SeedCipherPwHash(hcSeedBundle.parseSecret(pw), 'minimum')
	]);

	const revocationDerivationPath = 0;
	const encodedRevocationBytes = await derive(revocationDerivationPath, 'revocationRoot', pw);

	const deviceNumber = 1;
	const encodedDeviceBytes = await derive(deviceNumber, 'deviceRoot', pw);

	master.zero();

	return {
		master: encodedMasterBytes,
		device: encodedDeviceBytes,
		revocation: encodedRevocationBytes
	};

	async function derive(derivationPath, bundleType, passphrase) {
		const root = master.derive(derivationPath, {
			bundle_type: bundleType
		});
		root.setAppData({
			device_number: derivationPath,
			generate_by: 'keymanager-v1.0'
		});
		const encodedBytes = root.lock([
			new hcSeedBundle.SeedCipherPwHash(hcSeedBundle.parseSecret(passphrase), 'minimum')
		]);
		return encodedBytes;
	}
}
