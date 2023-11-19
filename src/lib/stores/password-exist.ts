import { writable } from 'svelte/store';
import { storageService } from '$services';
import { PasswordAndSecureDataSchema, type AreaName, type ChangesType } from '$types';
import { hashPassword } from '$helpers';
import { LOCAL, PASSWORD_WITH_DEVICE_KEY } from '$const';

const createPasswordExistStore = () => {
	const { subscribe, update } = writable<boolean | null>(null, () => {
		const validateAndUpdate = (result: unknown) => {
			const validatedResult = PasswordAndSecureDataSchema.safeParse(result);
			update(() => validatedResult.success);
		};

		const listener = (changes: ChangesType, namespace: AreaName) => {
			if (namespace === LOCAL) {
				validateAndUpdate(changes[PASSWORD_WITH_DEVICE_KEY]);
			}
		};

		storageService.get(
			{
				key: PASSWORD_WITH_DEVICE_KEY,
				area: LOCAL
			},
			(result: unknown) => validateAndUpdate(result)
		);

		storageService.addListener(listener);

		return () => {
			storageService.removeListener(listener);
		};
	});

	return {
		subscribe,
		validate: async (password: string) => {
			const result = await storageService.getWithoutCallback({
				key: PASSWORD_WITH_DEVICE_KEY,
				area: LOCAL
			});
			const validatedResult = PasswordAndSecureDataSchema.safeParse(result);

			return (
				validatedResult.success && (await hashPassword(password)) === validatedResult.data.password
			);
		}
	};
};

const passwordExistStore = createPasswordExistStore();

export { passwordExistStore };
