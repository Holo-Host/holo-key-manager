import { createMutation, useQueryClient, createQuery } from '@tanstack/svelte-query';
import { storageService } from '$services';
import { PasswordAndSecureDataSchema, SessionStateSchema } from '$types';
import {
	LOCAL,
	PASSWORD_WITH_DEVICE_KEY,
	SESSION,
	SESSION_DATA,
	SESSION_DATA_KEY,
	SETUP_KEY
} from '$const';
import { encryptData, hashPassword } from '$helpers';

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
				key: PASSWORD_WITH_DEVICE_KEY,
				area: LOCAL
			});

			const validatedResult = PasswordAndSecureDataSchema.safeParse(result);

			if (
				validatedResult.success &&
				(await hashPassword(password)) === validatedResult.data.password
			) {
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
	const setupQuery = createQuery({
		queryKey: [SETUP_KEY],
		queryFn: async () => {
			const data = await storageService.getWithoutCallback({
				key: PASSWORD_WITH_DEVICE_KEY,
				area: LOCAL
			});

			const validatedData = PasswordAndSecureDataSchema.safeParse(data);
			return validatedData.success;
		}
	});
	const passwordWithDeviceKeyMutation = createMutation({
		mutationFn: async (mutationData: { password: string; secretData: Uint8Array }) => {
			const hash = await hashPassword(mutationData.password);
			storageService.set({
				key: PASSWORD_WITH_DEVICE_KEY,
				value: {
					password: hash,
					secureData: await encryptData(mutationData.secretData, hash)
				},
				area: LOCAL
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SETUP_KEY] });
		}
	});

	return { setupQuery, passwordWithDeviceKeyMutation, sessionQuery, signInMutation };
}
