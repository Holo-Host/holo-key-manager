import { writable } from 'svelte/store';

import { generateKeys } from '$services';
import type { KeysState } from '$shared/types';

const initKeysStore = () => {
	const initialState: KeysState = {
		keys: {
			encodedMaster: null,
			encodedDeviceWithExtensionPassword: null,
			encodedDevice: null,
			encodedRevocation: null
		},
		loading: false
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		isInitialState: () =>
			subscribe((state) => JSON.stringify(state) === JSON.stringify(initialState)),
		subscribe,
		generate: async (passphrase: string, password: string) => {
			update((state) => ({ ...state, loading: true }));
			try {
				const keys = await generateKeys(passphrase, password);
				set({ keys, loading: false });
			} catch (error) {
				set(initialState);
			}
		},
		resetAll: () => update(() => initialState)
	};
};

export const keysStore = initKeysStore();
