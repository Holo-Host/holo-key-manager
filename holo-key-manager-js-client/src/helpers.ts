import { HOLO_KEY_MANAGER_EXTENSION_MARKER_ID, SENDER_WEBAPP } from '@sharedConst';
import { createMessageWithId } from '@sharedServices';
import { type Message, type MessageWithId, MessageWithIdSchema } from '@sharedTypes';

const isWindowDefined = () => typeof window !== 'undefined';

export const sendMessage = (message: Message): Promise<MessageWithId> =>
	new Promise((resolve, reject) => {
		if (!isWindowDefined()) {
			reject(new Error('window is not defined'));
			return;
		}

		const messageWithId = createMessageWithId(message);

		const removeListener = () => window.removeEventListener('message', responseHandler);
		const responseHandler = (event: MessageEvent) => {
			const parseResult = MessageWithIdSchema.safeParse(event.data);
			if (!parseResult.success) {
				return;
			}
			const responseData = parseResult.data;
			if (responseData.id !== messageWithId.id || responseData.sender === SENDER_WEBAPP) {
				return;
			}
			resolve(responseData);
			removeListener();
		};

		window.postMessage(messageWithId, '*');
		window.addEventListener('message', responseHandler);

		setTimeout(() => {
			removeListener();
			reject(new Error('Response timeout'));
		}, 30000);
	});

const isFirefox = () => navigator.userAgent.indexOf('Firefox') !== -1;

export const checkContentScriptAndBrowser = () => {
	if (!document.getElementById(HOLO_KEY_MANAGER_EXTENSION_MARKER_ID)) {
		const errorMessage =
			'Holo Key Manager extension is not installed' +
			(isFirefox() ? ' or permissions are not granted' : '');
		throw new Error(errorMessage);
	}
};
