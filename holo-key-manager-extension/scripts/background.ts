import {
	GENERIC_ERROR,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	SENDER_EXTENSION,
	SIGN_IN,
	SIGN_UP,
	SIGN_UP_STARTED,
	SUCCESS
} from '@shared/const';
import { createQueryParams } from '@shared/helpers';
import { isAppSignUpComplete, isSetupComplete } from '@shared/services';
import {
	type ActionPayload,
	type Message,
	MessageWithIdSchema,
	type WindowProperties
} from '@shared/types';

let windowId: number | undefined;

type SendResponse = (response?: Message) => void;
type SendResponseWithSender = (response: ActionPayload) => void;

const handleError = (sendResponse: SendResponseWithSender) => {
	windowId = undefined;
	sendResponse({ action: GENERIC_ERROR });
};

const createWindowProperties = ({
	happId,
	happName
}: {
	happId?: string;
	happName?: string;
}): WindowProperties => {
	const queryParams = createQueryParams({ happId, happName });
	const urlSuffix = queryParams ? `?${queryParams}` : '';
	return {
		url: `webapp-extension/setup.html${urlSuffix}`,
		type: 'popup',
		height: 500,
		width: 375,
		top: 100,
		left: 1100
	};
};

const updateOrCreateWindow = async (
	successAction: typeof SIGN_UP_STARTED | typeof SUCCESS | typeof NEEDS_SETUP,
	sendResponse: SendResponseWithSender,
	happId?: string,
	happName?: string
) => {
	const windowProperties = createWindowProperties({ happId, happName });
	const handleWindowUpdateOrCreate = () =>
		chrome.runtime.lastError ? handleError(sendResponse) : sendResponse({ action: successAction });

	if (typeof windowId === 'number') {
		chrome.windows.update(
			windowId,
			{ ...windowProperties, focused: true },
			handleWindowUpdateOrCreate
		);
	} else {
		chrome.windows.create(windowProperties, (newWindow) => {
			if (!newWindow) return;
			windowId = newWindow.id;
			chrome.windows.onRemoved.addListener((id) => {
				if (id === windowId) windowId = undefined;
			});
			handleWindowUpdateOrCreate();
		});
	}
};

const processMessage = async (message: Message, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_EXTENSION });
	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success) return;

	try {
		if (!(await isSetupComplete())) {
			return updateOrCreateWindow(NEEDS_SETUP, sendResponseWithSender);
		}

		if (parsedMessage.data.action === SIGN_UP) {
			return updateOrCreateWindow(
				SIGN_UP_STARTED,
				sendResponseWithSender,
				parsedMessage.data.payload.happId,
				parsedMessage.data.payload.happName
			);
		}

		if (
			parsedMessage.data.action === SIGN_IN &&
			!(await isAppSignUpComplete(parsedMessage.data.payload.happId))
		) {
			return sendResponseWithSender({ action: NO_KEY_FOR_HAPP });
		}

		return updateOrCreateWindow(SUCCESS, sendResponseWithSender);
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	processMessage(message, sendResponse);
	return true;
});
