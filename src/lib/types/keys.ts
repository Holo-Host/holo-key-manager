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
