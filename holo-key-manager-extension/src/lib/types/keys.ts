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

const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);
const nonNegativeNumber = (fieldName: string) =>
	z.number().nonnegative(`${fieldName} must be a non-negative number`);

export const RegisterKeySchema = z.object({
	deepkeyAgent: requiredString('Deepkey Agent'),
	newKey: requiredString('New Key'),
	appName: requiredString('App Name'),
	installedAppId: requiredString('Installed App ID'),
	appIndex: nonNegativeNumber('App Index'),
	dnaHashes: z.array(z.string()),
	keyName: requiredString('Key Name'),
	happLogo: z.string().optional(),
	happUiUrl: z.string().optional()
});

export type RegisterKeyInput = z.infer<typeof RegisterKeySchema>;

export const GetKeysObjectParamsSchema = z.object({
	deepkeyAgent: requiredString('Deepkey Agent'),
	timestamp: nonNegativeNumber('Timestamp')
});

export type GetKeysObjectParams = z.infer<typeof GetKeysObjectParamsSchema>;

export const GetKeysResponseSchema = z.object({
	appName: requiredString('App Name'),
	installedAppId: requiredString('Installed App ID'),
	appIndex: nonNegativeNumber('App Index'),
	metadata: z.object({
		keyName: requiredString('Key Name'),
		happLogo: z.string().optional(),
		happUiUrl: z.string().optional()
	})
});

export type GetKeysResponse = z.infer<typeof GetKeysResponseSchema>;

export const ArrayKeyItemSchema = z.object({
	happId: z.string(),
	happName: z.string(),
	keyName: z.string(),
	happLogo: z.string().optional(),
	happUiUrl: z.string().optional()
});

export type ArrayKeyItem = z.infer<typeof ArrayKeyItemSchema>;

export const ArrayKeySchema = z.array(ArrayKeyItemSchema);
export type ArrayKey = z.infer<typeof ArrayKeySchema>;
