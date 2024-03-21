import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import { handleSuccess } from '$helpers';
import { unlockKey } from '$services';
import {
	APPS_LIST,
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY
} from '$shared/const';
import { isSetupComplete, storageService } from '$shared/services';
import {
	AppsListSchema,
	EncryptedDeviceKeySchema,
	HashSaltSchema,
	SessionStateSchema
} from '$shared/types';
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
		mutationFn: async (mutationData: { app_key_name: string; happId: string }) => {
			const appsListData = await storageService.getWithoutCallback({
				key: APPS_LIST,
				area: LOCAL
			});
			const parsedAppsListData = AppsListSchema.safeParse(appsListData);

			return storageService.set({
				key: APPS_LIST,
				value: [
					...(parsedAppsListData.success ? parsedAppsListData.data : []),
					{
						keyName: mutationData.app_key_name,
						happId: mutationData.happId,
						isDeleted: false
					}
				],
				area: LOCAL
			});
		}
	});
}
