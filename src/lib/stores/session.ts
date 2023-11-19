import { writable } from 'svelte/store';
import { type SessionState, SessionStateSchema, type AreaName, type ChangesType } from '$types';
import { storageService } from '$services';
import { SESSION, SESSION_DATA } from '$const';

const createSessionStore = () => {
	const { subscribe, set, update } = writable<SessionState>(null, () => {
		const validateAndUpdate = (result: unknown) => {
			const validatedResult = SessionStateSchema.safeParse(result);
			update(() => (validatedResult.success ? validatedResult.data : false));
		};

		const listener = (changes: ChangesType, namespace: AreaName) => {
			if (namespace === SESSION) {
				validateAndUpdate(changes[SESSION_DATA]);
			}
		};

		storageService.get(
			{
				key: SESSION_DATA,
				area: SESSION
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
		set: (value: SessionState) => {
			set(value);
			storageService.set({
				key: SESSION_DATA,
				value: value ?? false,
				area: SESSION
			});
		}
	};
};

export const sessionStore = createSessionStore();
