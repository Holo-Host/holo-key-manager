// @ts-nocheck
import * as hcSeedBundle from 'hcSeedBundle';

export async function generateKeys(passphrase: string): Promise<GeneratedKeys> {
	await hcSeedBundle.seedBundleReady;

	const master = hcSeedBundle.UnlockedSeedBundle.newRandom({
		bundle_type: 'master'
	});
	master.setAppData({
		generate_by: 'keymanager-v1.0'
	});
	const encodedMasterBytes: Uint8Array = master.lock([
		new hcSeedBundle.SeedCipherPwHash(
			hcSeedBundle.parseSecret(new TextEncoder().encode(passphrase)),
			'minimum'
		)
	]);

	const revocationDerivationPath = 0;
	const encodedRevocationBytes: Uint8Array = await derive(
		revocationDerivationPath,
		'revocationRoot'
	);

	const deviceNumber = 1;
	const encodedDeviceBytes: Uint8Array = await derive(deviceNumber, 'deviceRoot');

	master.zero();

	return {
		master: encodedMasterBytes,
		device: encodedDeviceBytes,
		revocation: encodedRevocationBytes
	};

	async function derive(derivationPath, bundleType) {
		const root = master.derive(derivationPath, {
			bundle_type: bundleType
		});
		root.setAppData({
			device_number: derivationPath,
			generate_by: 'keymanager-v1.0'
		});
		const encodedBytes = root.lock([
			new hcSeedBundle.SeedCipherPwHash(
				hcSeedBundle.parseSecret(new TextEncoder().encode(passphrase)),
				'minimum'
			)
		]);
		return encodedBytes;
	}
}