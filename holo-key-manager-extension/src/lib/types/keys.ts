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
