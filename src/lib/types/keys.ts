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

export const HashSaltSchema = z.object({
	salt: z.string(),
	hash: z.string()
});

export type HashSalt = z.infer<typeof HashSaltSchema>;

export const EncryptedDeviceKeySchema = z.string();

export type EncryptedDeviceKey = z.infer<typeof EncryptedDeviceKeySchema>;
