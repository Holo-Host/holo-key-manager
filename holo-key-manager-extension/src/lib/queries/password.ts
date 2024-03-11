import { createMutation, createQuery, type QueryClient } from '@tanstack/svelte-query';
import { get } from 'svelte/store';

import { getPassword, handleSuccess, hashPassword, verifyPassword } from '$helpers';
import { lockKey, unlockKey } from '$services';
import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY,
	SETUP_PASSWORD
} from '$sharedConst';
import { storageService } from '$sharedServices';
import { deviceKeyContentStore, passphraseStore, passwordStore } from '$stores';
import { EncryptedDeviceKeySchema } from '$types';

const storePassword = async (password: string) => {
	const hashSalt = await hashPassword(password);
	return storageService.set({
		key: PASSWORD,
		value: hashSalt,
		area: LOCAL
	});
};

export function createSetupPasswordQuery() {
	return createQuery({
		queryKey: [SETUP_PASSWORD],
		queryFn: async () => {
			const parsedResult = await getPassword();
			return parsedResult.success;
		}
	});
}

export function createPasswordMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: storePassword,
		onSuccess: handleSuccess(queryClient, [SETUP_PASSWORD])
	});
}

export function createPasswordAndStoreDeviceKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const deviceKey = get(deviceKeyContentStore);
			const passphrase = get(passphraseStore);
			if (!deviceKey) throw new Error('Something went wrong');

			const decryptedKey = await unlockKey(deviceKey, passphrase);
			await storePassword(password);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, password),
				area: LOCAL
			});
			decryptedKey.zero();
			deviceKeyContentStore.clean();
			passphraseStore.clean();
			passwordStore.reset();
			storageService.set({ key: SESSION_DATA, value: null, area: SESSION });
		},
		onSuccess: handleSuccess(queryClient, [SETUP_KEY])
	});
}

export function createSignInMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const parsedResult = await getPassword();
			if (!parsedResult.success || !(await verifyPassword(password, parsedResult.data)))
				throw new Error('Invalid password or data');

			const deviceKey = await storageService.getWithoutCallback({
				key: DEVICE_KEY,
				area: LOCAL
			});
			const parsedDeviceKey = EncryptedDeviceKeySchema.safeParse(deviceKey);
			if (!parsedDeviceKey.success) throw new Error('Invalid device key');

			const decryptedKey = await unlockKey(parsedDeviceKey.data, password);
			decryptedKey.zero();

			return storageService.set({
				key: SESSION_DATA,
				value: await lockKey(decryptedKey, SESSION),
				area: SESSION
			});
		},
		onSuccess: handleSuccess(queryClient, [SESSION_DATA_KEY])
	});
}

export function createChangePasswordWithDeviceKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (mutationData: { newPassword: string; oldPassword: string }) => {
			const parsedResult = await getPassword();

			if (
				!parsedResult.success ||
				!(await verifyPassword(mutationData.oldPassword, parsedResult.data))
			) {
				throw new Error('Invalid password');
			}

			const deviceKey = await storageService.getWithoutCallback({
				key: DEVICE_KEY,
				area: LOCAL
			});

			const parsedDeviceKey = EncryptedDeviceKeySchema.safeParse(deviceKey);

			if (!parsedDeviceKey.success) {
				throw new Error('Invalid device key');
			}

			const decryptedKey = await unlockKey(parsedDeviceKey.data, mutationData.oldPassword);

			await storePassword(mutationData.newPassword);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, mutationData.newPassword),
				area: LOCAL
			});
			decryptedKey.zero();
			storageService.set({
				key: SESSION_DATA,
				value: null,
				area: SESSION
			});
		},

		onSuccess: handleSuccess(queryClient, [SESSION_DATA_KEY])
	});
}
