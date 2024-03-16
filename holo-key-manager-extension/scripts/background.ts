import { GENERIC_ERROR, NEEDS_SETUP, SENDER_EXTENSION, SIGN_UP, SUCCESS } from '@sharedConst';
import { isSetupComplete } from '@sharedServices';
import { type ActionPayload, type Message, MessageWithIdSchema } from '@sharedTypes';

let windowId: number | undefined;

type SendResponse = (response?: Message) => void;
type SendResponseWithSender = (response: ActionPayload) => void;

const handleError = (error: string, sendResponse: SendResponseWithSender) => {
	windowId = undefined;
	sendResponse({ action: GENERIC_ERROR });
};

const createAndFocusWindow = async (sendResponse: SendResponseWithSender) => {
	if (typeof windowId === 'number') {
		chrome.windows.update(windowId, { focused: true }, () => {
			if (chrome.runtime.lastError) {
				handleError('Error focusing window: ' + chrome.runtime.lastError.message, sendResponse);
			} else {
				sendResponse({ action: SUCCESS });
			}
		});
		return true;
	}
	return false;
};

const createWindow = () => {
	chrome.windows.create(
		{
			url: 'sign.html',
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
	actionType: typeof SUCCESS | typeof NEEDS_SETUP,
	sendResponse: SendResponseWithSender
) => {
	if (await createAndFocusWindow(sendResponse)) return;
	createWindow();
	sendResponse({ action: actionType });
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	(async () => {
		const sendResponseWithSender = (response: ActionPayload) =>
			sendResponse({ ...response, sender: SENDER_EXTENSION });

		const parsedMessage = MessageWithIdSchema.safeParse(message);
		if (!parsedMessage.success) return;
		if (parsedMessage.data.action !== SIGN_UP) return;

		const setupComplete = await isSetupComplete();
		const actionType = setupComplete ? SUCCESS : NEEDS_SETUP;

		try {
			handleAction(actionType, sendResponseWithSender);
		} catch (error) {
			handleError(
				`Error processing sign in: ${error instanceof Error ? error.message : String(error)}`,
				sendResponseWithSender
			);
		}
	})();

	return true;
});
