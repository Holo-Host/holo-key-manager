import {
	GENERIC_ERROR,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	SENDER_EXTENSION,
	SIGN_IN,
	SIGN_UP,
	SUCCESS
} from '@sharedConst';
import { isAppSignUpComplete, isSetupComplete } from '@sharedServices';
import { type ActionPayload, type Message, MessageWithIdSchema } from '@sharedTypes';

let windowId: number | undefined;

type SendResponse = (response?: Message) => void;
type SendResponseWithSender = (response: ActionPayload) => void;

const handleError = (sendResponse: SendResponseWithSender) => {
	windowId = undefined;
	sendResponse({ action: GENERIC_ERROR });
};

const updateWindowFocus = (sendResponse: SendResponseWithSender) => {
	chrome.windows.update(windowId as number, { focused: true }, () => {
		if (chrome.runtime.lastError) {
			handleError(sendResponse);
		} else {
			sendResponse({ action: SUCCESS });
		}
	});
};

const createAndFocusWindow = async (sendResponse: SendResponseWithSender) => {
	if (typeof windowId === 'number') {
		updateWindowFocus(sendResponse);
		return true;
	}
	return false;
};

const createWindow = () => {
	chrome.windows.create(
		{
			url: 'sign-up-key.html',
			type: 'popup',
			height: 500,
			width: 375,
			top: 100,
			left: 1100
		},
		(newWindow) => {
			if (!newWindow) return;
			windowId = newWindow.id;
			chrome.windows.onRemoved.addListener((id) => {
				if (id === windowId) windowId = undefined;
			});
		}
	);
};

const handleAction = async (
	actionType: typeof SUCCESS | typeof NEEDS_SETUP | typeof NO_KEY_FOR_HAPP,
	sendResponse: SendResponseWithSender
) => {
	if (!(await createAndFocusWindow(sendResponse))) {
		createWindow();
	}
	sendResponse({ action: actionType });
};

const processMessage = async (message: Message, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_EXTENSION });

	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success) return;

	try {
		const setupComplete = await isSetupComplete();
		if (!setupComplete) {
			return handleAction(NEEDS_SETUP, sendResponseWithSender);
		}

		if (parsedMessage.data.action === SIGN_UP) {
			return handleAction(SUCCESS, sendResponseWithSender);
		}

		const signUpIncomplete =
			parsedMessage.data.action === SIGN_IN &&
			!(await isAppSignUpComplete(parsedMessage.data.payload.happId));
		if (signUpIncomplete) {
			return sendResponseWithSender({ action: NO_KEY_FOR_HAPP });
		}

		return handleAction(SUCCESS, sendResponseWithSender);
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	processMessage(message, sendResponse);
	return true;
});
