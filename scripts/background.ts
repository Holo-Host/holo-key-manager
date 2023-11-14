console.log('Background script loaded');

async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

async function storePasswordHash(password: string): Promise<void> {
	const hashedPassword = await hashPassword(password);
	chrome.storage.local.set({ passwordHash: hashedPassword });
}

async function validatePassword(password: string): Promise<boolean> {
	const hashedPassword = await hashPassword(password);
	const storedHash = (await chrome.storage.local.get('passwordHash')).passwordHash;
	return hashedPassword === storedHash;
}

chrome.runtime.onMessage.addListener(async (message: any, sender, sendResponse) => {
	if (message.type === 'SETUP_PASSWORD') {
		await storePasswordHash(message.password);
		sendResponse({ status: 'success' });
		return true; // Keeps the message channel open
	}
	if (message.type === 'VALIDATE_PASSWORD') {
		const isValid = await validatePassword(message.password);
		chrome.runtime.sendMessage({ type: 'VALIDATION_RESPONSE', isValid });
	}
});
