import { isChromeStorageSafe } from '$helpers';
import { STORAGE_KEY, type ChangesType, type SessionState } from '$types';
import { writable } from 'svelte/store';

const createSessionStore = () => {
	const { subscribe, set, update } = writable<SessionState>({ session: false }, () => {
		const listener = (changes: ChangesType, namespace: string) => {
			if (namespace === 'session' && changes[STORAGE_KEY]?.newValue) {
				console.log('Session store updated from chrome.storage.session');
				update(() => changes[STORAGE_KEY]?.newValue ?? { session: false });
			}
		};

		// When the store is first created, try to load existing state from chrome.storage.session
		isChromeStorageSafe() &&
			chrome.storage.session.get([STORAGE_KEY], (result) => {
				result[STORAGE_KEY] && set(result[STORAGE_KEY]);
			});

		isChromeStorageSafe() && chrome.storage.onChanged.addListener(listener);

		// Return a function that can be called to unsubscribe from the store
		return () => {
			isChromeStorageSafe() && chrome.storage.onChanged.removeListener(listener);
		};
	});

	return {
		subscribe,
		set: (value: SessionState) => {
			set(value);
			isChromeStorageSafe() && chrome.storage.session.set({ [STORAGE_KEY]: value });
		}
	};
};

const sessionStore = createSessionStore();

export { sessionStore };
