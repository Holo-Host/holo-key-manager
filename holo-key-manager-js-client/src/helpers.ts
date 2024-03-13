import { SENDER_WEBAPP } from '@sharedConst';
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
				console.error(event.data);
				console.error('Invalid message format:', parseResult.error);
				return;
			}
			const responseData = parseResult.data;
			if (responseData.id !== messageWithId.id || responseData.sender === SENDER_WEBAPP) {
				console.error('Invalid message id or sender:', responseData.id, responseData.sender);
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
