import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_PASSWORD
} from '$const';
import { getPassword, hashPassword, verifyPassword } from '$helpers';
import { lockKey, storageService, unlockKey } from '$services';
import { EncryptedDeviceKeySchema } from '$types';
import { createMutation, createQuery, type QueryClient } from '@tanstack/svelte-query';

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
		mutationFn: async (password: string) => {
			const hash = await hashPassword(password);
			storageService.set({
				key: PASSWORD,
				value: hash,
				area: LOCAL
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_PASSWORD] });
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
			const newHashSalt = await hashPassword(mutationData.newPassword);

			storageService.set({
				key: PASSWORD,
				value: newHashSalt,
				area: LOCAL
			});
			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, newHashSalt.hash),
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
