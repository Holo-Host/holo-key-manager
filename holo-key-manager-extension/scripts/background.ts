import { SENDER_EXTENSION } from '@sharedConst';
import { type ActionPayload, type Message, MessageWithIdSchema } from '@sharedTypes';

let windowId: number | undefined;

type SendResponse = (response?: Message) => void;
type SendResponseWithSender = (response: ActionPayload) => void;

const handleError = (error: string, sendResponse: SendResponseWithSender) => {
	console.error(error);
	windowId = undefined;
	sendResponse({ action: 'GenericError' });
};

const createAndFocusWindow = async (sendResponse: SendResponseWithSender) => {
	if (typeof windowId === 'number') {
		chrome.windows.update(windowId, { focused: true }, () => {
			if (chrome.runtime.lastError) {
				handleError('Error focusing window: ' + chrome.runtime.lastError.message, sendResponse);
			} else {
				sendResponse({ action: 'Success' });
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

const handleSignIn = async (sendResponse: SendResponseWithSender) => {
	if (await createAndFocusWindow(sendResponse)) return;
	createWindow();
	sendResponse({ action: 'Success' });
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_EXTENSION });

	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success || parsedMessage.data.action !== 'SignIn') return;
	try {
		handleSignIn(sendResponseWithSender);
	} catch (error) {
		handleError(
			'Error processing sign in: ' + (error instanceof Error ? error.message : String(error)),
			sendResponseWithSender
		);
	}
	return true;
});

chrome.runtime.onInstalled.addListener(function () {
	chrome.permissions.request(
		{
			origins: ['*://localhost/*']
		},
		function (granted) {
			if (granted) {
				console.log('Permission to access localhost granted');
			} else {
				console.log('Permission to access localhost denied');
			}
		}
	);
});
