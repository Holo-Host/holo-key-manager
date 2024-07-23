import { HOLO_KEY_MANAGER_EXTENSION_MARKER_ID, SENDER_WEBAPP } from '@shared/const';
import { parseMessageSchema } from '@shared/helpers';
import { createMessageWithId } from '@shared/services';
import { type Message, type MessageWithId, MessageWithIdSchema } from '@shared/types';

const isWindowDefined = () => typeof window !== 'undefined';

const isExpectedPayload = <T>(payload: unknown): payload is T => {
	return typeof payload === 'object' && payload !== null;
};

export const parseMessageAndCheckAction = (response: MessageWithId, expectedAction: string) => {
	const parsedMessageSchema = parseMessageSchema(response);
	const { action } = parsedMessageSchema.data;

	if (action !== expectedAction) {
		throw new Error(parsedMessageSchema.data.action);
	}

	return parsedMessageSchema.data;
};

export const parseMessagePayload = <T>(response: MessageWithId, expectedAction: string): T => {
	const data = parseMessageAndCheckAction(response, expectedAction);

	if ('payload' in data && isExpectedPayload<T>(data.payload)) {
		return data.payload;
	}

	throw new Error(data.action);
};

export const sendMessage = (message: Message): Promise<MessageWithId> =>
	new Promise((resolve, reject) => {
		if (!isWindowDefined()) {
			reject(new Error('window is not defined'));
			return;
		}

		const messageWithId = createMessageWithId(message);

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
			window.removeEventListener('message', responseHandler);
		};

		// Using '*' as the target origin is necessary for cross-browser extension compatibility.
		// This allows communication between the content script and the webpage across different browsers.
		// Security note: We have a dedicated test in @preventSignatureFromOtherOrigin.ts that verifies
		// the security of this communication. Additionally, we check the origin in the background script
		// to ensure that only authenticated origins can sign messages.
		// TODO: Consider alternatives to postMessage(..., '*') in the future, as discussed in:
		// https://github.com/w3c/webextensions/issues/78
		window.postMessage(messageWithId, '*');
		window.addEventListener('message', responseHandler);
	});

export const checkContentScriptAndBrowser = () => {
	if (!document.getElementById(HOLO_KEY_MANAGER_EXTENSION_MARKER_ID)) {
		const errorMessage = 'Holo Key Manager extension is not installed';
		throw new Error(errorMessage);
	}
};
