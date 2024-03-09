import type { HashSalt } from '$commonTypes';

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
