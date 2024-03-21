export const isChromeDefined = () => typeof chrome !== 'undefined';
export const isChromeStorageSafe = () =>
	isChromeDefined() && chrome.storage && chrome.storage.session;

export const createQueryParams = (params: Record<string, string | undefined>) =>
	new URLSearchParams(
		Object.entries(params).reduce(
			(acc, [key, value]) => {
				if (value) acc[key] = value;
				return acc;
			},
			{} as Record<string, string>
		)
	).toString();
