import { isChromeStorageSafe } from '$helpers';
import type { AreaName, ChangesType, StorageKey } from '$types';

type StorageService = {
	set(key: StorageKey, value: unknown, area: 'local' | 'session'): void;
	get(key: StorageKey, callback: (value: unknown) => void, area: 'local' | 'session'): void;
	getWithoutCallback: (key: StorageKey, area: 'local' | 'session') => Promise<unknown>;
	addListener(listener: (changes: ChangesType, namespace: AreaName) => void): void;
	removeListener(listener: (changes: ChangesType, namespace: AreaName) => void): void;
};

export const storageService: StorageService = {
	set: (key: StorageKey, value: unknown, area: 'local' | 'session') => {
		if (isChromeStorageSafe()) {
			chrome.storage[area].set({ [key]: value });
		}
	},
	get: (key: StorageKey, callback: (value: unknown) => void, area: 'local' | 'session') => {
		if (isChromeStorageSafe()) {
			chrome.storage[area].get([key], (result: ChangesType) => {
				callback(result[key]);
			});
		} else {
			callback(null);
		}
	},
	getWithoutCallback: (key: StorageKey, area: 'local' | 'session') => {
		if (isChromeStorageSafe()) {
			return new Promise((resolve) => {
				chrome.storage[area].get([key], (result: ChangesType) => {
					resolve(result[key]);
				});
			});
		} else {
			return Promise.resolve(null);
		}
	},
	addListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => {
		if (isChromeStorageSafe()) {
			chrome.storage.onChanged.addListener(listener);
		}
	},
	removeListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => {
		if (isChromeStorageSafe()) {
			chrome.storage.onChanged.removeListener(listener);
		}
	}
};
