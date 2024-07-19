import { writable } from 'svelte/store';

import type { GeneratedKeys } from '$types';

const initKeysStore = () => {
	const initialState: GeneratedKeys = {
		encodedMaster: null,
		encodedDeviceWithExtensionPassword: null,
		encodedDevice: null,
		encodedRevocation: null
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		isInitialState: () =>
			subscribe((state) => JSON.stringify(state) === JSON.stringify(initialState)),
		subscribe,
		set,
		resetAll: () => update(() => initialState)
	};
};

export const keysStore = initKeysStore();
