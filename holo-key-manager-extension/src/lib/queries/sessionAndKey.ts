import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import { handleSuccess } from '$helpers';
import { unlockKey } from '$services';
import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY
} from '$sharedConst';
import { isSetupComplete, storageService } from '$sharedServices';
import { EncryptedDeviceKeySchema, HashSaltSchema, SessionStateSchema } from '$sharedTypes';
import { deviceKeyContentStore, passphraseStore } from '$stores';

export function createSessionQuery() {
	return createQuery({
		queryKey: [SESSION_DATA_KEY],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: SESSION_DATA,
				area: SESSION
			});
			const parsedData = SessionStateSchema.safeParse(data);
			return parsedData.success;
		}
	});
}

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

export function createApplicationKeyMutation() {
	return createMutation({
		mutationFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: SESSION_DATA,
				area: SESSION
			});
			const parsedData = SessionStateSchema.safeParse(data);
			if (!parsedData.success) throw new Error('Invalid device key');

			const decryptedKey = await unlockKey(parsedData.data, SESSION);

			console.log(decryptedKey);

			const app_key_1 = decryptedKey.derive(0);

			console.log(app_key_1);

			return decryptedKey.zero();
		}
	});
}
