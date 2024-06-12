import { z } from 'zod';

export type SetSecret = 'set' | 'confirm';

export type GeneratedKeys = {
	encodedMaster: Uint8Array | null;
	encodedDeviceWithExtensionPassword: string | null;
	encodedDevice: Uint8Array | null;
	encodedRevocation: Uint8Array | null;
};

export type KeysState = {
	keys: GeneratedKeys;
	loading: boolean;
};

export const RegisterKeySchema = z.object({
	deepkeyAgent: z.string().min(1, 'Deepkey Agent is required'),
	newKey: z.string().min(1, 'New Key is required'),
	appName: z.string().min(1, 'App Name is required'),
	installedAppId: z.string().min(1, 'Installed App ID is required'),
	appIndex: z.number().nonnegative('App Index must be a non-negative number'),
	dnaHashes: z.array(z.string()),
	keyName: z.string().min(1, 'Key Name is required')
});

export type RegisterKeyInput = z.infer<typeof RegisterKeySchema>;

export const GetKeysObjectParamsSchema = z.object({
	deepkeyAgent: z.string().min(1, 'Deepkey Agent is required'),
	timestamp: z.number().nonnegative('Timestamp must be a non-negative number')
});

export type GetKeysObjectParams = z.infer<typeof GetKeysObjectParamsSchema>;
