import { writable } from 'svelte/store';

const createPassphraseStore = () => {
	const { subscribe, set } = writable('');

	const clean = () => set('');

	return {
		subscribe,
		set,
		clean
	};
};

const passphraseStore = createPassphraseStore();

export { passphraseStore };
