export const isChromeStorageSafe = () =>
	typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session;
