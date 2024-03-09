import { writable } from 'svelte/store';

const createPasswordStore = () => {
	const { subscribe, set } = writable('');

	const reset = () => set('');

	return {
		subscribe,
		set,
		reset
	};
};

const passwordStore = createPasswordStore();

export { passwordStore };
