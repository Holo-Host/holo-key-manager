import type { SecureData } from '$types';

function hexStringToArrayBuffer(hexString: string) {
	if (hexString.length % 2 !== 0) {
		throw new Error('Invalid hexString length. It must be even.');
	}
	const bytes = new Uint8Array(hexString.length / 2);
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
	}
	return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binary_string = atob(base64);
	const len = binary_string.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}

function arrayBufferToHexString(buffer: ArrayBuffer) {
	const byteArray = new Uint8Array(buffer);
	let hexString = '';
	byteArray.forEach(function (byte) {
		hexString += ('0' + byte.toString(16)).slice(-2);
	});
	return hexString;
}

export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const algo = { name: 'SHA-256' };
	const hashBuffer = await crypto.subtle.digest(algo, data);
	return arrayBufferToHexString(hashBuffer); // Convert ArrayBuffer to hex string
}

export async function encryptData(
	secretData: Uint8Array,
	passwordHashHex: string // Accept hex string
): Promise<SecureData> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const algo: AesGcmParams = { name: 'AES-GCM', iv };
	const passwordHash = hexStringToArrayBuffer(passwordHashHex);
	console.log('Imported key length (bytes):', passwordHash.byteLength);
	const key = await crypto.subtle.importKey('raw', passwordHash, algo, false, ['encrypt']);

	const encrypted = await crypto.subtle.encrypt(algo, key, secretData);
	return {
		encryptedData: arrayBufferToBase64(encrypted),
		iv: arrayBufferToBase64(iv)
	};
}

export async function decryptData(
	encryptedData: SecureData,
	passwordHashHex: string // Accept hex string
): Promise<Uint8Array> {
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
}
