import { writable } from 'svelte/store';
import { type SessionState, SessionStateSchema, type AreaName, type ChangesType } from '$types';
import { storageService } from '$services';

const createSessionStore = () => {
	const { subscribe, set, update } = writable<SessionState>(null, () => {
		const listener = (changes: ChangesType, namespace: AreaName) => {
			if (namespace === 'session') {
				const newValue = SessionStateSchema.safeParse(changes['sessionData']);
				update(() => (newValue.success ? newValue.data : false));
			}
		};

		storageService.get(
			{
				key: 'sessionData',
				area: 'session'
			},
			(result: unknown) => {
				const validatedResult = SessionStateSchema.safeParse(result);
				if (validatedResult.success) {
					set(validatedResult.data);
				} else {
					set(false);
				}
			}
		);

		storageService.addListener(listener);

		return () => {
			storageService.removeListener(listener);
		};
	});

	return {
		subscribe,
		set: (value: SessionState) => {
			set(value);
			storageService.set({
				key: 'sessionData',
				value: value ?? false,
				area: 'session'
			});
		}
	};
};

export const sessionStore = createSessionStore();
