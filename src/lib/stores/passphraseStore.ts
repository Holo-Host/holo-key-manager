import { writable } from 'svelte/store';

const passphraseStore = writable('');

export { passphraseStore };
