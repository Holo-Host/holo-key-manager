import type { SecureData, HashSalt } from '$types';

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

const deriveBits = async (password: string, salt: Uint8Array, iterations: number) => {
	const encodedPassword = new TextEncoder().encode(password);
	const algo = {
		name: 'PBKDF2',
		hash: 'SHA-256',
		salt: new TextEncoder().encode(arrayBufferToHexString(salt)),
		iterations: iterations
	};
	const key = await crypto.subtle.importKey('raw', encodedPassword, { name: 'PBKDF2' }, false, [
		'deriveBits'
	]);
	return await crypto.subtle.deriveBits(algo, key, 256);
};

export const hashPassword = async (password: string): Promise<HashSalt> => {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const derivedBits = await deriveBits(password, salt, 100000);
	return {
		hash: arrayBufferToHexString(derivedBits),
		salt: arrayBufferToHexString(salt)
	};
};

export const verifyPassword = async (
	inputPassword: string,
	storedHashSalt: HashSalt
): Promise<boolean> => {
	const saltBuffer = hexStringToArrayBuffer(storedHashSalt.salt);
	const derivedBits = await deriveBits(inputPassword, new Uint8Array(saltBuffer), 100000);
	return arrayBufferToHexString(derivedBits) === storedHashSalt.hash;
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
