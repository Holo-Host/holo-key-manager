import { uid } from 'uid';

import { HOLO_KEY_MANAGER_APP_ID } from '../const';
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

export const sendMessage = (message: Message) => chrome.runtime.sendMessage(message);
