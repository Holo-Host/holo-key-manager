import { relevantKeys } from '../const';
import { type ActionPayload, MessageSchema, type MessageWithId } from '../types';

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

export const createQueryParams = (params: ActionPayload) => {
	const additionalParams = relevantKeys.reduce(
		(acc, key) => {
			if (
				'payload' in params &&
				params.payload &&
				typeof params.payload === 'object' &&
				key in params.payload
			) {
				return { ...acc, [key]: String(params.payload[key as keyof typeof params.payload]) };
			}
			return acc;
		},
		{ action: params.action }
	);

	return new URLSearchParams(additionalParams).toString();
};

export const parseMessageSchema = (response: MessageWithId) => {
	const parsedMessageSchema = MessageSchema.safeParse(response);
	if (!parsedMessageSchema.success) throw new Error('Invalid response format');
	return parsedMessageSchema;
};
