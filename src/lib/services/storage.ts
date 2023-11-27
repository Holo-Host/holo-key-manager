import { isChromeStorageSafe } from '$helpers';
import type { AreaName, ChangesType, SecureData } from '$types';
import type { LOCAL, SESSION, SESSION_DATA, PASSWORD, DEVICE_KEY } from '$const';

type SetSession = { key: typeof SESSION_DATA; value: boolean; area: typeof SESSION };
type GetSession = { key: typeof SESSION_DATA; area: typeof SESSION };

type SetPassword = {
	key: typeof PASSWORD;
	value: string;
	area: typeof LOCAL;
};
type GetPassword = { key: typeof PASSWORD; area: typeof LOCAL };

type SetDeviceKey = {
	key: typeof DEVICE_KEY;
	value: SecureData;
	area: typeof LOCAL;
};
type GetDeviceKey = { key: typeof DEVICE_KEY; area: typeof LOCAL };

type StorageSetItem = SetSession | SetPassword | SetDeviceKey;
type StorageGetItem = GetSession | GetPassword | GetDeviceKey;

type StorageService = {
	set: (item: StorageSetItem) => void;
	get: (item: StorageGetItem, callback: (value: unknown) => void) => void;
	getWithoutCallback: (item: StorageGetItem) => Promise<unknown>;
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
