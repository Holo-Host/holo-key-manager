import type { SecureData } from '$types';

const hexStringToArrayBuffer = (hexString: string) => {
	if (hexString.length % 2 !== 0) {
		throw new Error('Invalid hexString length. It must be even.');
	}
	const hexBytes = hexString.match(/.{1,2}/g);
	if (hexBytes === null) {
		throw new Error('Invalid hexString format. It must contain only hexadecimal characters.');
	}
	return new Uint8Array(hexBytes.map((byte) => parseInt(byte, 16))).buffer;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string =>
	btoa(String.fromCharCode(...new Uint8Array(buffer)));

const base64ToArrayBuffer = (base64: string): ArrayBuffer =>
	new Uint8Array(
		atob(base64)
			.split('')
			.map((char) => char.charCodeAt(0))
	).buffer;

const arrayBufferToHexString = (buffer: ArrayBuffer) =>
	Array.prototype.map
		.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
		.join('');

export const hashPassword = async (password: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const algo = { name: 'SHA-256' };
	const hashBuffer = await crypto.subtle.digest(algo, data);
	return arrayBufferToHexString(hashBuffer); // Convert ArrayBuffer to hex string
};

export const encryptData = async (
	secretData: Uint8Array,
	passwordHashHex: string
): Promise<SecureData> => {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const algo: AesGcmParams = { name: 'AES-GCM', iv };
	const passwordHash = hexStringToArrayBuffer(passwordHashHex);
	const key = await crypto.subtle.importKey('raw', passwordHash, algo, false, ['encrypt']);

	const encrypted = await crypto.subtle.encrypt(algo, key, secretData);
	return {
		encryptedData: arrayBufferToBase64(encrypted),
		iv: arrayBufferToBase64(iv)
	};
};

export const decryptData = async (
	encryptedData: SecureData,
	passwordHashHex: string // Accept hex string
): Promise<Uint8Array> => {
	const iv = base64ToArrayBuffer(encryptedData.iv);
	const algo = { name: 'AES-GCM', iv };
	const passwordHash = hexStringToArrayBuffer(passwordHashHex); // Convert hex string to ArrayBuffer
	const key = await crypto.subtle.importKey('raw', passwordHash, algo, false, ['decrypt']);

	const decrypted = await crypto.subtle.decrypt(
		algo,
		key,
		base64ToArrayBuffer(encryptedData.encryptedData)
	);
	return new Uint8Array(decrypted);
};
