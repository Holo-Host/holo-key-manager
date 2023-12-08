import {
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY
} from '$const';
import { storageService } from '$services';
import { EncryptedDeviceKeySchema, HashSaltSchema, SessionStateSchema } from '$types';
import { QueryClient, createMutation, createQuery } from '@tanstack/svelte-query';

export function createSessionQuery() {
	return createQuery({
		queryKey: [SESSION_DATA_KEY],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: SESSION_DATA,
				area: SESSION
			});
			const parsedData = SessionStateSchema.safeParse(data);
			return parsedData.success ? parsedData.data : false;
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

			const parsedData = EncryptedDeviceKeySchema.safeParse(data);
			return parsedData.success;
		}
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

			console.log(deviceKey);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_KEY] });
		}
	});
}
