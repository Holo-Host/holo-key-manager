import { uid } from 'uid';

import { HOLO_KEY_MANAGER_APP_ID } from '../const';
import { isChromeMessageSafe } from '../helpers';
import type { Message, MessageWithId } from '../types';

export const createMessageWithId = (message: Message): MessageWithId => ({
	...message,
	id: uid(),
	appId: HOLO_KEY_MANAGER_APP_ID
});

export const responseToMessage = (message: Message, messageId: string): MessageWithId => ({
	...message,
	id: messageId,
	appId: HOLO_KEY_MANAGER_APP_ID
});

export const sendMessage = (message: MessageWithId) => {
	if (isChromeMessageSafe()) {
		return chrome.runtime.sendMessage(message);
	}
	throw new Error('chrome.runtime.sendMessage is not safe to use');
};
