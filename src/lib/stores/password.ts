import { writable } from 'svelte/store';

const createPasswordStore = () => {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set
	};
};

const passwordStore = createPasswordStore();

export { passwordStore };
