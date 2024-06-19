import { BACKGROUND_SCRIPT_RECEIVED_DATA } from '$shared/const';
import { parseMessageSchema } from '$shared/helpers';
import { createMessageWithId, responseToMessage, sendMessage } from '$shared/services';
import type { Message } from '$shared/types';

export const sendMessageAndHandleResponse = async (message: Message, id?: string) => {
	const messageWithId = id ? responseToMessage(message, id) : createMessageWithId(message);

	const response = await sendMessage(messageWithId);

	const parsedResponse = parseMessageSchema(response);

	if (parsedResponse.data.action !== BACKGROUND_SCRIPT_RECEIVED_DATA)
		throw new Error('Error sending data to webapp');
};
