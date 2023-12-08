import { writable } from 'svelte/store';

const createPasswordStore = () => {
	const { subscribe, set } = writable('');

	const clean = () => set('');

	return {
		subscribe,
		set,
		clean
	};
};

const passwordStore = createPasswordStore();

export { passwordStore };
