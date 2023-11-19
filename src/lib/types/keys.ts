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

export const Password = z.string();

export const SecureDataSchema = z.object({
	encryptedData: z.string(),
	iv: z.string()
});

export type SecureData = z.infer<typeof SecureDataSchema>;

export const PasswordAndSecureDataSchema = z.object({
	password: Password,
	secureData: SecureDataSchema
});

export type PasswordAndSecureData = z.infer<typeof PasswordAndSecureDataSchema>;
