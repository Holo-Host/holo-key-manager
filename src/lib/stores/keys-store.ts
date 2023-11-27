import type { KeysState } from '$types';
import { writable } from 'svelte/store';
import { generateKeys } from '../services/generate-keys';

const initKeysStore = () => {
	const initialState: KeysState = {
		keys: {
			master: null,
			revocation: null,
			device: null
		},
		loading: false
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		isInitialState: () =>
			subscribe((state) => JSON.stringify(state) === JSON.stringify(initialState)),
		subscribe,
		generate: async (passphrase: string) => {
			update((state) => ({ ...state, loading: true }));
			try {
				const keys = await generateKeys(passphrase);
				set({ keys, loading: false });
			} catch (error) {
				set(initialState);
			}
		},
		resetAll: () => update(() => initialState)
	};
};

export const keysStore = initKeysStore();
