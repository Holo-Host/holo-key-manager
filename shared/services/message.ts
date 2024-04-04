import { uid } from 'uid';

import { HOLO_KEY_MANAGER_APP_ID } from '../const';
import { isChromeMessageSafe } from '../helpers';
import type { Message } from '../types';

export const createMessageWithId = (message: Message) => ({
	...message,
	id: uid(),
	appId: HOLO_KEY_MANAGER_APP_ID
});

export const responseToMessage = (message: Message, messageId: string) => ({
	...message,
	id: messageId,
	appId: HOLO_KEY_MANAGER_APP_ID
});

export const sendMessage = (message: Message) => {
	if (isChromeMessageSafe()) {
		return chrome.runtime.sendMessage(message);
	}
	throw new Error('chrome.runtime.sendMessage is not safe to use');
};
