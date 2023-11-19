import { isChromeStorageSafe } from '$helpers';
import type { AreaName, ChangesType, PasswordAndSecureData } from '$types';
import type { LOCAL, SESSION, SESSION_DATA, PASSWORD_WITH_DEVICE_KEY } from '$const';

type StorageItem =
	| { key: typeof SESSION_DATA; value: boolean; area: typeof SESSION }
	| { key: typeof PASSWORD_WITH_DEVICE_KEY; value: PasswordAndSecureData; area: typeof LOCAL };

type GetStorageItem =
	| { key: typeof SESSION_DATA; area: typeof SESSION }
	| { key: typeof PASSWORD_WITH_DEVICE_KEY; area: typeof LOCAL };

type StorageService = {
	set: (item: StorageItem) => void;
	get: (item: GetStorageItem, callback: (value: unknown) => void) => void;
	getWithoutCallback: (item: GetStorageItem) => Promise<unknown>;
	addListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
	removeListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
};

export const storageService: StorageService = {
	set: ({ key, value, area }) => {
		if (isChromeStorageSafe()) {
			chrome.storage[area].set({ [key]: value });
		}
	},
	get: ({ key, area }, callback) => {
		if (isChromeStorageSafe()) {
			chrome.storage[area].get([key], (result: ChangesType) => {
				callback(result[key]);
			});
		} else {
			callback(null);
		}
	},
	getWithoutCallback: ({ key, area }) => {
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
