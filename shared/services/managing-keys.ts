// import { randombytes_buf, crypto_kdf_derive_from_key, crypto_sign_seed_keypair } from 'libsodium-wrappers';

// export const createSecret = (): Uint8Array => {
// 	return randombytes_buf(32);
// };

// const deriveKey = (seed: Uint8Array, subkeyId: number, context: string = 'SeedBndl'): Uint8Array => {
// 	return crypto_kdf_derive_from_key(32, subkeyId, context, seed);
// };

// async function generateKeyPair(seed: Uint8Array): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
// 	await libsodium.ready;
// 	const { publicKey, privateKey } = crypto_sign_seed_keypair(seed);
// 	return { publicKey, privateKey };
// }

// // Function to sign a message
// async function signMessage(seed: Uint8Array, message: string): Promise<Uint8Array> {
// 	await libsodium.ready;
// 	const { privateKey } = crypto_sign_seed_keypair(seed);
// 	const encoder = new TextEncoder();
// 	const encodedMessage = encoder.encode(message);
// 	const signature = crypto_sign(encodedMessage, privateKey);
// 	return new Uint8Array(signature);
// }
