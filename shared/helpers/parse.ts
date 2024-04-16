export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
	const paddedBase64 =
		base64.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (3 * base64.length) % 4);
	return Uint8Array.from(atob(paddedBase64), (c) => c.charCodeAt(0));
};
