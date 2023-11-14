import { writable } from 'svelte/store';

const createPassphraseStore = () => {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set
	};
};

const passphraseStore = createPassphraseStore();

export { passphraseStore };
