import { createMutation, createQuery, type QueryClient } from '@tanstack/svelte-query';
import { get } from 'svelte/store';

import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY,
	SETUP_PASSWORD
} from '$const';
import { getPassword, hashPassword, verifyPassword } from '$helpers';
import { lockKey, storageService, unlockKey } from '$services';
import { deviceKeyContentStore, passphraseStore } from '$stores';
import { EncryptedDeviceKeySchema } from '$types';

const storePasswordReturnHash = async (password: string) => {
	const hashSalt = await hashPassword(password);
	storageService.set({
		key: PASSWORD,
		value: hashSalt,
		area: LOCAL
	});
	return hashSalt.hash;
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
		mutationFn: storePasswordReturnHash,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_PASSWORD] });
		}
	});
}

export function createPasswordAndStoreDeviceKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const deviceKey = get(deviceKeyContentStore);
			const passphrase = get(passphraseStore);

			const decryptedKey = await unlockKey(deviceKey, passphrase);

			if (!deviceKey) {
				throw new Error('Something went wrong');
			}

			const newHash = await storePasswordReturnHash(password);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, newHash),
				area: LOCAL
			});
			decryptedKey.zero();
			deviceKeyContentStore.clean();
			passphraseStore.clean();
			storageService.set({
				key: SESSION_DATA,
				value: false,
				area: SESSION
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_KEY] });
		}
	});
}

export function createSignInMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const parsedResult = await getPassword();

			if (parsedResult.success && (await verifyPassword(password, parsedResult.data))) {
				return storageService.set({
					key: SESSION_DATA,
					value: true,
					area: SESSION
				});
			}

			throw new Error('Invalid password or data');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SESSION_DATA_KEY] });
		}
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

			const decryptedKey = await unlockKey(parsedDeviceKey.data, parsedResult.data.hash);

			const newHash = await storePasswordReturnHash(mutationData.newPassword);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, newHash),
				area: LOCAL
			});
			decryptedKey.zero();
			storageService.set({
				key: SESSION_DATA,
				value: false,
				area: SESSION
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SESSION_DATA_KEY] });
		}
	});
}
