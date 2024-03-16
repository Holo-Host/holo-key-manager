import { HOLO_KEY_MANAGER_EXTENSION_MARKER_ID, SENDER_EXTENSION } from '@sharedConst';
import { responseToMessage, sendMessage } from '@sharedServices';
import { MessageSchema, MessageWithIdSchema } from '@sharedTypes';

const parseAndHandleMessage = async (event: MessageEvent) => {
	const parsedResult = MessageWithIdSchema.safeParse(event.data);
	if (!parsedResult.success || parsedResult.data.sender === SENDER_EXTENSION) return;
	try {
		const response = await sendMessage(parsedResult.data);
		const parsedMessageSchema = MessageSchema.safeParse(response);
		if (!parsedMessageSchema.success) throw new Error('Invalid response format');
		window.postMessage(responseToMessage(parsedMessageSchema.data, parsedResult.data.id), '*');
	} catch (error) {
		window.postMessage(
			responseToMessage({ action: 'GenericError', sender: SENDER_EXTENSION }, parsedResult.data.id),
			'*'
		);
	}
};

window.addEventListener('message', parseAndHandleMessage);

const markerDiv = document.createElement('div');
markerDiv.id = HOLO_KEY_MANAGER_EXTENSION_MARKER_ID;
markerDiv.style.display = 'none';
document.body.appendChild(markerDiv);
