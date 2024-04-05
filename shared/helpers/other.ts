import { MessageSchema, type MessageWithId } from '../types';

export const isChromeDefined = () => typeof chrome !== 'undefined';
export const isChromeStorageSafe = () =>
	isChromeDefined() && chrome.storage && chrome.storage.session;

export const isChromeMessageSafe = () =>
	isChromeDefined() && chrome.runtime && chrome.runtime.sendMessage;

export const createQueryParams = (params: Record<string, string | boolean | undefined>) =>
	new URLSearchParams(
		Object.entries(params).reduce(
			(acc, [key, value]) => {
				if (value) acc[key] = String(value);
				return acc;
			},
			{} as Record<string, string>
		)
	).toString();

export const parseMessageSchema = (response: MessageWithId) => {
	const parsedMessageSchema = MessageSchema.safeParse(response);
	if (!parsedMessageSchema.success) throw new Error('Invalid response format');
	return parsedMessageSchema;
};
