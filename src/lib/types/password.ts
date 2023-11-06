export type SetPassphrase = 'set' | 'confirm';

export type GeneratedKeys = {
	master: Uint8Array;
	device: Uint8Array;
	revocation: Uint8Array;
};
