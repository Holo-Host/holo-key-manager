import type { LOCAL, SESSION } from '$const';
import { z } from 'zod';

export type AreaName = typeof SESSION | typeof LOCAL | 'sync' | 'managed';

export const SessionStateSchema = z.boolean();

export type SessionState = z.infer<typeof SessionStateSchema>;

export type ChangesType = {
	[key: string]: unknown;
};
