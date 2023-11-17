import { writable } from 'svelte/store';
import { type SessionState, SessionStateSchema, type AreaName, type ChangesType } from '$types';
import { storageService } from '$services';

const createSessionStore = () => {
	const { subscribe, set, update } = writable<SessionState>({ session: null }, () => {
		const listener = (changes: ChangesType, namespace: AreaName) => {
			if (namespace === 'session') {
				const newValue = SessionStateSchema.safeParse(changes['sessionData']);
				update(() => (newValue.success ? newValue.data : { session: false }));
			}
		};

		storageService.get(
			'sessionData',
			(result) => {
				const validatedResult = SessionStateSchema.safeParse(result);
				if (validatedResult.success) {
					set(validatedResult.data);
				} else {
					set({ session: false });
				}
			},
			'session'
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
			storageService.set('sessionData', value, 'session');
		}
	};
};

export const sessionStore = createSessionStore();
