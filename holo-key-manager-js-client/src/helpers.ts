import { type Message, MessageWithIdSchema } from '@sharedTypes';
import { uid } from 'uid';

const isWindowDefined = () => typeof window !== 'undefined';

const createMessageWithId = (message: Message) => ({
	...message,
	id: uid(),
	appId: 'holo-key-manager'
});

const handleResponse =
	(resolve: (value: Message | PromiseLike<Message>) => void, removeListener: () => void) =>
	(event: MessageEvent) => {
		const result = MessageWithIdSchema.safeParse(event.data);
		if (!result.success) {
			console.error('Invalid message format:', result.error);
			return;
		}
		resolve(event.data);
		removeListener();
	};

export const sendMessage = (message: Message): Promise<Message> =>
	new Promise((resolve, reject) => {
		if (!isWindowDefined()) {
			reject(new Error('window is not defined'));
			return;
		}

		const messageWithId = createMessageWithId(message);

		const removeListener = () => window.removeEventListener('message', responseHandler);
		const responseHandler = handleResponse(resolve, removeListener);

		window.addEventListener('message', responseHandler);
		window.postMessage(messageWithId, '*');

		setTimeout(() => {
			removeListener();
			reject(new Error('Response timeout'));
		}, 30000);
	});
