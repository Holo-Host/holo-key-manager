import { z } from 'zod';
import { writable } from 'svelte/store';
import { storageService } from '$services';
import type { AreaName, ChangesType } from '$types';
import { hashPassword } from '$helpers';

const createPasswordExistStore = () => {
	const { subscribe, set, update } = writable<boolean | null>(null, () => {
		const listener = (changes: ChangesType, namespace: AreaName) => {
			if (namespace === 'local' && 'password' in changes) {
				update(() => true);
			}
		};

		storageService.get('password', (result) => set(!!result), 'local');

		storageService.addListener(listener);

		return () => {
			storageService.removeListener(listener);
		};
	});

	return {
		subscribe,
		set: (value: boolean) => {
			set(value);
			storageService.set('password', value, 'local');
		},
		validate: async (password: string) => {
			const result = await storageService.getWithoutCallback('password', 'local');
			const validatedResult = z.string().safeParse(result);

			return validatedResult.success && (await hashPassword(password)) === validatedResult.data;
		}
	};
};

const passwordExistStore = createPasswordExistStore();

export { passwordExistStore };
