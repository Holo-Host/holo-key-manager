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

export const SecureDataSchema = z.object({
	encryptedData: z.instanceof(Uint8Array),
	iv: z.instanceof(Uint8Array)
});

export type SecureData = z.infer<typeof SecureDataSchema>;
