import {
	APP_NOT_AUTHENTICATED,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	EXTENSION_NOT_AUTHENTICATED,
	EXTENSION_SESSION_INFO,
	GENERIC_ERROR,
	GET_EXTENSION_SESSION,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	SENDER_BACKGROUND_SCRIPT,
	SENDER_EXTENSION,
	SENDER_WEBAPP,
	SETUP_EXTENSION_SESSION,
	SIGN_IN,
	SIGN_IN_SUCCESS,
	SIGN_MESSAGE,
	SIGN_MESSAGE_SUCCESS,
	SIGN_OUT,
	SIGN_OUT_SUCCESS,
	SIGN_UP,
	SIGN_UP_SUCCESS,
	UNKNOWN_ACTION
} from '@shared/const';
import { createQueryParams } from '@shared/helpers';
import { isAuthenticated, isSetupComplete, signOut } from '@shared/services';
import {
	type ActionPayload,
	type Message,
	type MessageWithId,
	MessageWithIdSchema,
	type WindowProperties
} from '@shared/types';

import { signMessageLogic } from './helpers';

// Important: This script is modified by a
// post-build script (build-scripts/fixBackgroundScriptForSigning.cjs)
// which may alter some of its intended behavior.

let windowId: number | undefined;

let session: string | undefined;

type SendResponse = (response?: Message) => void;
type SendResponseWithSender = (response: ActionPayload) => void;

const handleError = (sendResponse: SendResponseWithSender) => {
	windowId = undefined;
	sendResponse({ action: GENERIC_ERROR });
};

const createWindowProperties = async (parsedMessage?: MessageWithId): Promise<WindowProperties> => {
	const width = 375;
	const height = 500;
	const defaultLeft = 1100;
	const defaultTop = 100;

	const getDisplayInfo = async () => {
		try {
			const displays = await chrome.system.display.getInfo();
			return displays.find((d) => d.isPrimary) || displays[0];
		} catch (error) {
			return null;
		}
	};

	const calculatePosition = (display: chrome.system.display.DisplayInfo | null) => ({
		left: display ? display.workArea.width - width - 20 : defaultLeft,
		top: display ? Math.min(defaultTop, display.workArea.height - height) : defaultTop
	});

	const primaryDisplay = await getDisplayInfo();
	const { left, top } = calculatePosition(primaryDisplay);

	return {
		url: `webapp-extension/setup.html${parsedMessage ? `?${createQueryParams(parsedMessage)}` : ''}`,
		type: 'popup',
		width,
		height,
		top,
		left
	};
};

const createOrUpdateWindow = async (
	windowProperties: WindowProperties,
	handleWindowUpdateOrCreate: () => Promise<void>
) => {
	const onWindowCreated = (newWindow: chrome.windows.Window | undefined) => {
		if (chrome.runtime.lastError) {
			console.error('Window creation error:', JSON.stringify(chrome.runtime.lastError));
		}

		if (!newWindow) return;
		windowId = newWindow.id;
		chrome.windows.onRemoved.addListener((id) => {
			if (id === windowId) windowId = undefined;
		});
		handleWindowUpdateOrCreate();
	};

	if (windowId) {
		chrome.windows.remove(windowId, () => {
			windowId = undefined;
			chrome.windows.create(windowProperties, onWindowCreated);
		});
	} else {
		chrome.windows.create(windowProperties, onWindowCreated);
	}
};

const updateOrCreateWindowCommon = async (
	handleWindowUpdateOrCreate: () => Promise<void>,
	parsedMessage?: MessageWithId
) => createOrUpdateWindow(await createWindowProperties(parsedMessage), handleWindowUpdateOrCreate);

const updateOrCreateWindow = async (
	successAction: typeof NEEDS_SETUP,
	sendResponse: SendResponseWithSender
) =>
	await updateOrCreateWindowCommon(async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);
		try {
			sendResponse({ action: successAction });
		} catch (error) {
			handleError(sendResponse);
		}
	});

const waitForFormSubmission = (id: string): Promise<Message> =>
	new Promise((resolve) => {
		const messageListener = (
			message: MessageWithId,
			sender: chrome.runtime.MessageSender,
			sendResponse: SendResponse
		) => {
			if (message.sender !== SENDER_EXTENSION || message.id !== id) return;
			sendResponse({
				action: BACKGROUND_SCRIPT_RECEIVED_DATA,
				sender: SENDER_BACKGROUND_SCRIPT
			});
			chrome.runtime.onMessage.removeListener(messageListener);
			resolve(message);
		};
		chrome.runtime.onMessage.addListener(messageListener);
	});

const createOrUpdateDataResponseWindow = async (
	sendResponse: SendResponseWithSender,
	parsedMessage: MessageWithId
) =>
	await updateOrCreateWindowCommon(async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);

		try {
			const message = await waitForFormSubmission(parsedMessage.id);
			sendResponse(message);
		} catch (error) {
			handleError(sendResponse);
		}
	}, parsedMessage);

const processMessageWebApp = async (
	parsedMessage: MessageWithId,
	sendResponseWithSender: SendResponseWithSender
) => {
	try {
		if (!(await isSetupComplete())) {
			return updateOrCreateWindow(NEEDS_SETUP, sendResponseWithSender);
		}
		switch (parsedMessage.action) {
			case SIGN_UP:
			case SIGN_IN:
				return createOrUpdateDataResponseWindow(sendResponseWithSender, parsedMessage);
			case SIGN_MESSAGE:
				if (!session) {
					return sendResponseWithSender({ action: EXTENSION_NOT_AUTHENTICATED });
				}
				if (await isAuthenticated(parsedMessage.payload.happId, parsedMessage.origin)) {
					const signature = await signMessageLogic({ ...parsedMessage.payload, session });
					return sendResponseWithSender({
						action: SIGN_MESSAGE_SUCCESS,
						payload: signature
					});
				}
				return sendResponseWithSender({ action: APP_NOT_AUTHENTICATED });
			case SIGN_OUT:
				signOut(parsedMessage.payload.happId);
				return sendResponseWithSender({ action: SIGN_OUT_SUCCESS });
			default:
				return sendResponseWithSender({ action: UNKNOWN_ACTION });
		}
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

const processMessageExtension = async (
	parsedMessage: MessageWithId,
	sendResponseWithSender: SendResponseWithSender
) => {
	try {
		switch (parsedMessage.action) {
			case SETUP_EXTENSION_SESSION:
				session = parsedMessage.payload;
				return sendResponseWithSender({
					action: BACKGROUND_SCRIPT_RECEIVED_DATA
				});
			case GET_EXTENSION_SESSION:
				return sendResponseWithSender({
					action: EXTENSION_SESSION_INFO,
					payload: session
				});
			case NO_KEY_FOR_HAPP:
			case SIGN_IN_SUCCESS:
			case SIGN_UP_SUCCESS:
				break;
			default:
				return sendResponseWithSender({ action: UNKNOWN_ACTION });
		}
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_BACKGROUND_SCRIPT });

	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success) return;

	const processMessage = (sender: string) => {
		switch (sender) {
			case SENDER_WEBAPP:
				return processMessageWebApp;
			case SENDER_EXTENSION:
				return processMessageExtension;
			default:
				return null;
		}
	};

	const handler = processMessage(parsedMessage.data.sender);
	if (handler) {
		handler(parsedMessage.data, sendResponseWithSender);
	}
	return true;
});
