import { writable } from 'svelte/store';

import { getPassword } from '$helpers';
import type { KeysState } from '$types';

import { generateKeys } from '../services/generate-keys';

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
		generate: async (passphrase: string) => {
			update((state) => ({ ...state, loading: true }));
			try {
				const hashSalt = await getPassword();
				if (!hashSalt.success) {
					throw new Error('Password missing');
				}
				const keys = await generateKeys(passphrase, hashSalt.data.hash);
				set({ keys, loading: false });
			} catch (error) {
				set(initialState);
			}
		},
		resetAll: () => update(() => initialState)
	};
};

export const keysStore = initKeysStore();
