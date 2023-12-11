import { writable } from 'svelte/store';

const createDeviceKeyContentStore = () => {
	const { subscribe, set } = writable('');

	const clean = () => set('');

	return {
		subscribe,
		set,
		clean
	};
};

const deviceKeyContentStore = createDeviceKeyContentStore();

export { deviceKeyContentStore };
