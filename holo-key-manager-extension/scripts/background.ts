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

const createWindowProperties = (actionPayload: ActionPayload): WindowProperties => {
	const queryParams =
		actionPayload.action === SIGN_UP
			? createQueryParams({
					happName: actionPayload.payload.happName,
					happId: actionPayload.payload.happId
				})
			: '';
	const urlSuffix = queryParams ? `?${queryParams}` : '';
	return {
		url: `sign-up-key/setup.html${urlSuffix}`,
		type: 'popup',
		height: 500,
		width: 375,
		top: 100,
		left: 1100
	};
};

const updateOrCreateWindow = (
	sendResponse: SendResponseWithSender,
	actionPayload: ActionPayload
) => {
	const windowProperties = createWindowProperties(actionPayload);
	const handleWindowUpdateOrCreate = () =>
		chrome.runtime.lastError ? handleError(sendResponse) : sendResponse({ action: SUCCESS });

	const updateWindow = (updateWindowId: number) =>
		chrome.windows.update(
			updateWindowId,
			{ ...windowProperties, focused: true },
			handleWindowUpdateOrCreate
		);
	const createWindow = () =>
		chrome.windows.create(windowProperties, (newWindow) => {
			if (!newWindow) return;
			windowId = newWindow.id;
			chrome.windows.onRemoved.addListener((id) => {
				if (id === windowId) windowId = undefined;
			});
			handleWindowUpdateOrCreate();
		});

	typeof windowId === 'number' ? updateWindow(windowId) : createWindow();
};
const createAndFocusWindow = async (
	sendResponse: SendResponseWithSender,
	actionPayload: ActionPayload
) => {
	if (typeof windowId === 'number') {
		updateOrCreateWindow(sendResponse, actionPayload);
		return true;
	}
	return false;
};

const handleAction = async (actionPayload: ActionPayload, sendResponse: SendResponseWithSender) => {
	if (!(await createAndFocusWindow(sendResponse, actionPayload))) {
		updateOrCreateWindow(sendResponse, actionPayload);
	}
	sendResponse(actionPayload);
};

const processMessage = async (message: Message, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_EXTENSION });

	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success) return;

	try {
		const setupComplete = await isSetupComplete();
		if (!setupComplete) {
			return handleAction({ action: NEEDS_SETUP }, sendResponseWithSender);
		}

		if (parsedMessage.data.action === SIGN_UP) {
			return handleAction({ action: SIGN_UP_STARTED }, sendResponseWithSender);
		}

		const signUpIncomplete =
			parsedMessage.data.action === SIGN_IN &&
			!(await isAppSignUpComplete(parsedMessage.data.payload.happId));
		if (signUpIncomplete) {
			return sendResponseWithSender({ action: NO_KEY_FOR_HAPP });
		}

		return handleAction({ action: SUCCESS }, sendResponseWithSender);
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	processMessage(message, sendResponse);
	return true;
});
