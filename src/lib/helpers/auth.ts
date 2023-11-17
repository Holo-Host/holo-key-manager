import { passwordExistStore, sessionStore } from '$stores';
import { derived, type Readable } from 'svelte/store';

export function createIsAuthenticated(): Readable<boolean> {
	return derived([sessionStore, passwordExistStore], ([$sessionStore, $passwordExistStore]) =>
		Boolean($sessionStore && $passwordExistStore)
	);
}
