import { createMutation, useQueryClient, createQuery } from '@tanstack/svelte-query';
import { storageService } from '$services';
import { Password, SecureDataSchema, SessionStateSchema } from '$types';
import {
	LOCAL,
	PASSWORD,
	DEVICE_KEY,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY,
	SETUP_PASSWORD
} from '$const';
import { decryptData, encryptData, hashPassword } from '$helpers';

export function sessionStorageQueries() {
	const queryClient = useQueryClient();
	const sessionQuery = createQuery({
		queryKey: [SESSION_DATA_KEY],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: SESSION_DATA,
				area: SESSION
			});

			const validatedData = SessionStateSchema.safeParse(data);
			return validatedData.success ? validatedData.data : false;
		}
	});
	const signInMutation = createMutation({
		mutationFn: async (password: string) => {
			const result = await storageService.getWithoutCallback({
				key: PASSWORD,
				area: LOCAL
			});

			const validatedResult = Password.safeParse(result);

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
	const setupPasswordQuery = createQuery({
		queryKey: [SETUP_PASSWORD],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: PASSWORD,
				area: LOCAL
			});

			const validatedData = Password.safeParse(data);
			return validatedData.success;
		}
	});
	const setupDeviceKeyQuery = createQuery({
		queryKey: [SETUP_KEY],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: DEVICE_KEY,
				area: LOCAL
			});

			const validatedData = SecureDataSchema.safeParse(data);
			return validatedData.success;
		}
	});
	const createPassword = createMutation({
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
	const storeDeviceKey = createMutation({
		mutationFn: async (deviceKey: Uint8Array) => {
			const result = await storageService.getWithoutCallback({
				key: PASSWORD,
				area: LOCAL
			});

			const validatePassword = Password.safeParse(result);

			if (validatePassword.success) {
				storageService.set({
					key: DEVICE_KEY,
					value: await encryptData(deviceKey, validatePassword.data),
					area: LOCAL
				});
			}
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_KEY] });
		}
	});

	const changePasswordWithDeviceKeyMutation = createMutation({
		mutationFn: async (mutationData: { newPassword: string; oldPassword: string }) => {
			const oldHash = await hashPassword(mutationData.oldPassword);

			const result = await storageService.getWithoutCallback({
				key: PASSWORD,
				area: LOCAL
			});

			const validatePassword = Password.safeParse(result);

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

	return {
		createPassword,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		changePasswordWithDeviceKeyMutation,
		sessionQuery,
		signInMutation,
		storeDeviceKey
	};
}
