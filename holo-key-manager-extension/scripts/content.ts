import { responseToMessage, sendMessage } from '@sharedServices';
import { MessageSchema, MessageWithIdSchema } from '@sharedTypes';

const isMessageFromSelf = (event: MessageEvent) => event.source === window;
const parseAndHandleMessage = async (event: MessageEvent) => {
	if (!isMessageFromSelf(event)) return;
	const parsedResult = MessageWithIdSchema.safeParse(event.data);
	if (!parsedResult.success || parsedResult.data.action !== 'SignIn') return;

	try {
		const response = await sendMessage(parsedResult.data);
		const parsedMessageSchema = MessageSchema.safeParse(response);
		if (!parsedMessageSchema.success) throw new Error('Invalid response format');
		window.postMessage(responseToMessage(parsedMessageSchema.data, parsedResult.data.id), '*');
	} catch (error) {
		console.error(error);
	}
};

window.addEventListener('message', parseAndHandleMessage);
