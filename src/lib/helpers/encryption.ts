import type { SecureData } from '$types';

export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const algo: { name: string } = { name: 'SHA-256' };
	const hashBuffer = await crypto.subtle.digest(algo, data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

export async function encryptData(
	secretData: Uint8Array,
	passwordHash: string
): Promise<SecureData> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const algo: AesGcmParams = { name: 'AES-GCM', iv };
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(passwordHash),
		algo,
		false,
		['encrypt']
	);

	const encrypted = await crypto.subtle.encrypt(algo, key, secretData);
	return {
		encryptedData: new Uint8Array(encrypted),
		iv
	};
}

export async function decryptData(
	encryptedData: SecureData,
	passwordHash: string
): Promise<Uint8Array> {
	const algo: AesGcmParams = { name: 'AES-GCM', iv: encryptedData.iv };
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(passwordHash),
		algo,
		false,
		['decrypt']
	);

	const decrypted = await crypto.subtle.decrypt(algo, key, encryptedData.encryptedData);
	return new Uint8Array(decrypted);
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binary_string = atob(base64);
	const len = binary_string.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}
