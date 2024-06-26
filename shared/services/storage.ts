import { AUTHENTICATED_APPS_LIST, DEVICE_KEY, LOCAL, SESSION } from '../const';
import { isChromeStorageSafe } from '../helpers';
import {
	type AreaName,
	AuthenticatedAppsListSchema,
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

export const isAuthenticated = async (happId: string, origin?: string) => {
	if (!origin) return false;

	const data = await storageService.getWithoutCallback({
		key: AUTHENTICATED_APPS_LIST,
		area: SESSION
	});

	const parsedData = AuthenticatedAppsListSchema.safeParse(data);

	return (
		parsedData.success && happId in parsedData.data && parsedData.data[happId].origin === origin
	);
};

export const signOut = async (happId: string) => {
	const data = await storageService.getWithoutCallback({
		key: AUTHENTICATED_APPS_LIST,
		area: SESSION
	});

	const parsedData = AuthenticatedAppsListSchema.safeParse(data);

	if (parsedData.success) {
		const { [happId]: _, ...remainingApps } = parsedData.data;

		storageService.set({
			key: AUTHENTICATED_APPS_LIST,
			value: remainingApps,
			area: SESSION
		});
	}
};

export const getDeviceKey = async () => {
	const deviceKey = await storageService.getWithoutCallback({
		key: DEVICE_KEY,
		area: LOCAL
	});

	const parsedDeviceKey = EncryptedDeviceKeySchema.safeParse(deviceKey);

	if (!parsedDeviceKey.success) {
		throw new Error('Invalid device key');
	}

	return parsedDeviceKey.data;
};
