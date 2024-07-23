import { HOLO_KEY_MANAGER_EXTENSION_MARKER_ID, SENDER_BACKGROUND_SCRIPT } from '@shared/const';
import { parseMessageSchema } from '@shared/helpers';
import { responseToMessage, sendMessage } from '@shared/services';
import { MessageWithIdSchema } from '@shared/types';

const parseAndHandleMessage = async (event: MessageEvent) => {
	const parsedResult = MessageWithIdSchema.safeParse(event.data);
	if (!parsedResult.success || parsedResult.data.sender === SENDER_BACKGROUND_SCRIPT) return;
	try {
		const response = await sendMessage({ ...parsedResult.data, origin: event.origin });
		const parsedMessageSchema = parseMessageSchema(response);

		// Using '*' as the target origin is necessary for cross-browser extension compatibility.
		// This allows communication between the content script and the webpage across different browsers.
		// Security note: We have a dedicated test in @preventSignatureFromOtherOrigin.ts that verifies
		// the security of this communication. Additionally, we check the origin in the background script
		// to ensure that only authenticated origins can sign messages.
		// TODO: Consider alternatives to postMessage(..., '*') in the future, as discussed in:
		// https://github.com/w3c/webextensions/issues/78
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
