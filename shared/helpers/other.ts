import { relevantKeys } from '../const';
import { MessageSchema, type MessageWithId } from '../types';

export const isChromeDefined = () => typeof chrome !== 'undefined';
export const isChromeStorageSafe = () =>
	isChromeDefined() && chrome.storage && chrome.storage.session;

export const isChromeMessageSafe = () =>
	isChromeDefined() && chrome.runtime && chrome.runtime.sendMessage;

export const isChromePermissionsSafe = () =>
	isChromeDefined() &&
	chrome.permissions &&
	typeof chrome.permissions.request === 'function' &&
	typeof chrome.permissions.getAll === 'function';

export const createQueryParams = (parsedMessage: MessageWithId) => {
	const additionalParams = relevantKeys.reduce(
		(acc, key) => {
			if (
				'payload' in parsedMessage &&
				parsedMessage.payload &&
				typeof parsedMessage.payload === 'object' &&
				key in parsedMessage.payload
			) {
				return {
					...acc,
					[key]: String(parsedMessage.payload[key as keyof typeof parsedMessage.payload])
				};
			}
			return acc;
		},
		{
			action: parsedMessage.action,
			messageId: parsedMessage.id,
			origin: parsedMessage.origin || ''
		}
	);

	return new URLSearchParams(additionalParams).toString();
};

export const parseMessageSchema = (response: MessageWithId) => {
	const parsedMessageSchema = MessageSchema.safeParse(response);
	if (!parsedMessageSchema.success) throw new Error('Invalid response format');
	return parsedMessageSchema;
};
