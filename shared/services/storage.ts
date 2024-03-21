import { APPS_LIST, DEVICE_KEY, LOCAL } from '../const';
import { isChromeStorageSafe } from '../helpers';
import {
	AppsListSchema,
	type AreaName,
	type ChangesType,
	EncryptedDeviceKeySchema,
	type StorageService
} from '../types';

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

export const isSetupComplete = async () => {
	const data = await storageService.getWithoutCallback({
		key: DEVICE_KEY,
		area: LOCAL
	});

	const parsedData = EncryptedDeviceKeySchema.safeParse(data);
	return parsedData.success;
};

export const isAppSignUpComplete = async (happId: string) => {
	const data = await storageService.getWithoutCallback({
		key: APPS_LIST,
		area: LOCAL
	});

	const parsedData = AppsListSchema.safeParse(data);

	console.log(parsedData.success ? parsedData.data : '');
	return parsedData.success && parsedData.data.some((app) => app.happId === happId);
};
