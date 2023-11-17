import { z } from 'zod';

export type AreaName = 'session' | 'local' | 'sync' | 'managed';

export const SessionStateSchema = z.object({
	session: z.boolean().nullable()
});

export type SessionState = z.infer<typeof SessionStateSchema>;

export type StorageKey = 'sessionData' | 'password' | 'encryptedDeviceKey';

export type ChangesType = {
	[key: string]: unknown;
};
