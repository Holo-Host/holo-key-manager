import { z } from 'zod';

export type SetSecret = 'set' | 'confirm';

export type GeneratedKeys = {
	master: Uint8Array | null;
	device: Uint8Array | null;
	revocation: Uint8Array | null;
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

export const SecureDataSchema = z.object({
	encryptedData: z.string(),
	iv: z.string()
});

export type SecureData = z.infer<typeof SecureDataSchema>;
