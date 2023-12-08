import type { LOCAL, SESSION, SESSION_DATA, PASSWORD, DEVICE_KEY } from '$const';
import { z } from 'zod';
import type { HashSalt } from './keys';

export type AreaName = typeof SESSION | typeof LOCAL | 'sync' | 'managed';

export const SessionStateSchema = z.boolean();

export type SessionState = z.infer<typeof SessionStateSchema>;

export type ChangesType = {
	[key: string]: unknown;
};

type SetSession = { key: typeof SESSION_DATA; value: boolean; area: typeof SESSION };
type GetSession = { key: typeof SESSION_DATA; area: typeof SESSION };

type SetPassword = {
	key: typeof PASSWORD;
	value: HashSalt;
	area: typeof LOCAL;
};
type GetPassword = { key: typeof PASSWORD; area: typeof LOCAL };

type SetDeviceKey = {
	key: typeof DEVICE_KEY;
	value: string;
	area: typeof LOCAL;
};
type GetDeviceKey = { key: typeof DEVICE_KEY; area: typeof LOCAL };

type StorageSetItem = SetSession | SetPassword | SetDeviceKey;
type StorageGetItem = GetSession | GetPassword | GetDeviceKey;

export type StorageService = {
	set: (item: StorageSetItem) => void;
	get: (item: StorageGetItem, callback: (value: unknown) => void) => void;
	getWithoutCallback: (item: StorageGetItem) => Promise<unknown>;
	addListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
	removeListener: (listener: (changes: ChangesType, namespace: AreaName) => void) => void;
};
