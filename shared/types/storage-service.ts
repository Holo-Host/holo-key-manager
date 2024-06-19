import { z } from 'zod';

import type { AUTHENTICATED_APPS_LIST, DEVICE_KEY, LOCAL, PASSWORD, SESSION } from '../const';
import { HappDetailsSchema } from './general';

export const EncryptedDeviceKeySchema = z.string();

export type EncryptedDeviceKey = z.infer<typeof EncryptedDeviceKeySchema>;

export const HashSaltSchema = z.object({
	salt: z.string(),
	hash: z.string()
});

export type HashSalt = z.infer<typeof HashSaltSchema>;

export const AuthenticatedAppsListSchema = z.record(
	z.string(),
	z.object({
		index: z.number(),
		origin: z.string()
	})
);

export type AuthenticatedAppsList = z.infer<typeof AuthenticatedAppsListSchema>;

export type AreaName = typeof SESSION | typeof LOCAL | 'sync' | 'managed';

export type ChangesType = {
	[key: string]: unknown;
};

export const AppsListSchema = z.array(
	HappDetailsSchema.extend({
		keyName: z.string(),
		isDeleted: z.boolean()
	})
);

export type AppsList = z.infer<typeof AppsListSchema>;

type SetAction<T, V, A = typeof SESSION | typeof LOCAL> = {
	key: T;
	value: V;
	area: A;
};

type GetAction<T, A = typeof SESSION | typeof LOCAL> = {
	key: T;
	area: A;
};

type StorageSetItem =
	| SetAction<typeof AUTHENTICATED_APPS_LIST, AuthenticatedAppsList, typeof SESSION>
	| SetAction<typeof PASSWORD, HashSalt, typeof LOCAL>
	| SetAction<typeof DEVICE_KEY, string, typeof LOCAL>;

type StorageGetItem =
	| GetAction<typeof AUTHENTICATED_APPS_LIST, typeof SESSION>
	| GetAction<typeof PASSWORD, typeof LOCAL>
	| GetAction<typeof DEVICE_KEY, typeof LOCAL>;

export type StorageService = {
	set: (item: StorageSetItem) => void;
	get: (item: StorageGetItem, callback: (value: unknown) => void) => void;
	getWithoutCallback: (item: StorageGetItem) => Promise<unknown>;
	addListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
	removeListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
};
