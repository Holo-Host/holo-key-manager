import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_PASSWORD
} from '$const';
import { decryptData, encryptData, hashPassword } from '$helpers';
import { storageService } from '$services';
import { Password, SecureDataSchema } from '$types';
import { createMutation, createQuery, type QueryClient } from '@tanstack/svelte-query';

const getPassword = async () => {
	const data = await storageService.getWithoutCallback({ key: PASSWORD, area: LOCAL });
	return Password.safeParse(data);
};

export function createSetupPasswordQuery() {
	return createQuery({
		queryKey: [SETUP_PASSWORD],
		queryFn: async () => {
			const validatedResult = await getPassword();
			return validatedResult.success;
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
			const validatedResult = await getPassword();

			if (validatedResult.success && (await hashPassword(password)) === validatedResult.data) {
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
			const oldHash = await hashPassword(mutationData.oldPassword);

			const validatePassword = await getPassword();

			if (!validatePassword.success || oldHash !== validatePassword.data) {
				throw new Error('Invalid password');
			}

			const deviceKey = await storageService.getWithoutCallback({
				key: DEVICE_KEY,
				area: LOCAL
			});

			const validatedDeviceKey = SecureDataSchema.safeParse(deviceKey);

			if (!validatedDeviceKey.success) {
				throw new Error('Invalid device key');
			}

			const decryptedData = await decryptData(validatedDeviceKey.data, oldHash);
			const newHash = await hashPassword(mutationData.newPassword);

			storageService.set({
				key: PASSWORD,
				value: newHash,
				area: LOCAL
			});
			storageService.set({
				key: DEVICE_KEY,
				value: await encryptData(decryptedData, newHash),
				area: LOCAL
			});
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
