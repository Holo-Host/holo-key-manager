export const isChromeDefined = () => typeof chrome !== 'undefined';

export const isChromeStorageSafe = () =>
	isChromeDefined() && chrome.storage && chrome.storage.session;
