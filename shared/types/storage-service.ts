import { z } from 'zod';

import type {
	APPS_LIST,
	AUTHENTICATED_APPS_LIST,
	DEVICE_KEY,
	LOCAL,
	PASSWORD,
	SESSION,
	SESSION_STORAGE_KEY
} from '../const';
import { HappDetailsSchema } from './general';

export const EncryptedDeviceKeySchema = z.string();

export type EncryptedDeviceKey = z.infer<typeof EncryptedDeviceKeySchema>;

export const HashSaltSchema = z.object({
	salt: z.string(),
	hash: z.string()
});

export type HashSalt = z.infer<typeof HashSaltSchema>;

export const AppsListSchema = z.array(
	HappDetailsSchema.extend({
		keyName: z.string(),
		isDeleted: z.boolean()
	})
);

export type AppsList = z.infer<typeof AppsListSchema>;

export const AuthenticatedAppsListSchema = z.record(z.string(), z.number());

export type AuthenticatedAppsList = z.infer<typeof AuthenticatedAppsListSchema>;

export type AreaName = typeof SESSION | typeof LOCAL | 'sync' | 'managed';

export const SessionStateSchema = z.string();

export type SessionState = z.infer<typeof SessionStateSchema>;

export type ChangesType = {
	[key: string]: unknown;
};

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
	| SetAction<typeof SESSION_STORAGE_KEY, string | null, typeof SESSION>
	| SetAction<typeof AUTHENTICATED_APPS_LIST, AuthenticatedAppsList, typeof SESSION>
	| SetAction<typeof PASSWORD, HashSalt, typeof LOCAL>
	| SetAction<typeof APPS_LIST, AppsList, typeof LOCAL>
	| SetAction<typeof DEVICE_KEY, string, typeof LOCAL>;

type StorageGetItem =
	| GetAction<typeof SESSION_STORAGE_KEY, typeof SESSION>
	| GetAction<typeof AUTHENTICATED_APPS_LIST, typeof SESSION>
	| GetAction<typeof APPS_LIST, typeof LOCAL>
	| GetAction<typeof PASSWORD, typeof LOCAL>
	| GetAction<typeof DEVICE_KEY, typeof LOCAL>;

export type StorageService = {
	set: (item: StorageSetItem) => void;
	get: (item: StorageGetItem, callback: (value: unknown) => void) => void;
	getWithoutCallback: (item: StorageGetItem) => Promise<unknown>;
	addListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
	removeListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
};
