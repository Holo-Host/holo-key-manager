import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import { handleSuccess } from '$helpers';
import { unlockKey } from '$services';
import { DEVICE_KEY, LOCAL, PASSWORD, SETUP_KEY } from '$shared/const';
import { getSessionKey, isSetupComplete, storageService } from '$shared/services';
import { EncryptedDeviceKeySchema, HashSaltSchema } from '$shared/types';
import { deviceKeyContentStore, passphraseStore } from '$stores';

export function createSetupDeviceKeyQuery() {
	return createQuery({
		queryKey: [SETUP_KEY],
		queryFn: isSetupComplete
	});
}

export function createStoreDeviceKey(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (deviceKey: string) => {
			const result = await storageService.getWithoutCallback({
				key: PASSWORD,
				area: LOCAL
			});
			const parsedPassword = HashSaltSchema.safeParse(result);

			if (!parsedPassword.success) {
				throw new Error('Something went wrong');
			}

			storageService.set({
				key: DEVICE_KEY,
				value: deviceKey,
				area: LOCAL
			});
		},
		onSuccess: handleSuccess(queryClient, [SETUP_KEY])
	});
}

export function createRecoverDeviceKeyMutation() {
	return createMutation({
		mutationFn: async (mutationData: { deviceKey: string; passphrase: string }) => {
			const parsedDeviceKey = EncryptedDeviceKeySchema.safeParse(mutationData.deviceKey);

			if (!parsedDeviceKey.success) {
				throw new Error('Invalid device key');
			}

			const decryptedKey = await unlockKey(parsedDeviceKey.data, mutationData.passphrase);

			deviceKeyContentStore.set(parsedDeviceKey.data);
			passphraseStore.set(mutationData.passphrase);

			return decryptedKey.zero();
		}
	});
}
