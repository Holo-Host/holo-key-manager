import { HOLO_KEY_MANAGER_EXTENSION_MARKER_ID, SENDER_BACKGROUND_SCRIPT } from '@shared/const';
import { parseMessageSchema } from '@shared/helpers';
import { responseToMessage, sendMessage } from '@shared/services';
import { MessageWithIdSchema } from '@shared/types';

const parseAndHandleMessage = async (event: MessageEvent) => {
	const parsedResult = MessageWithIdSchema.safeParse(event.data);
	if (!parsedResult.success || parsedResult.data.sender === SENDER_BACKGROUND_SCRIPT) return;
	try {
		window.postMessage('Sending message to background script', '*');
		window.postMessage(JSON.stringify(chrome), '*');
		window.postMessage(JSON.stringify(chrome.runtime), '*');
		window.postMessage(JSON.stringify(chrome.runtime.sendMessage), '*');
		const response = await sendMessage({ ...parsedResult.data, origin: event.origin });
		const parsedMessageSchema = parseMessageSchema(response);
		window.postMessage(responseToMessage(parsedMessageSchema.data, parsedResult.data.id), '*');
	} catch (error) {
		window.postMessage(
			responseToMessage(
				{ action: 'GenericError', sender: SENDER_BACKGROUND_SCRIPT },
				parsedResult.data.id
			),
			'*'
		);
	}
};

window.addEventListener('message', parseAndHandleMessage);

const markerDiv = document.createElement('div');
markerDiv.id = HOLO_KEY_MANAGER_EXTENSION_MARKER_ID;
markerDiv.style.display = 'none';
document.body.appendChild(markerDiv);
