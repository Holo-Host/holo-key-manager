import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY
} from '$const';
import { encryptData } from '$helpers';
import { storageService } from '$services';
import { Password, SecureDataSchema, SessionStateSchema } from '$types';
import { QueryClient, createMutation, createQuery } from '@tanstack/svelte-query';

export function createSessionQuery() {
	return createQuery({
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
}

export function createSetupDeviceKeyQuery() {
	return createQuery({
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
}

export function createStoreDeviceKey(queryClient: QueryClient) {
	return createMutation({
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

			throw new Error('Something went wrong');
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_KEY] });
		}
	});
}
