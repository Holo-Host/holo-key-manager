import {
	BACKGROUND_SCRIPT_RECEIVED_FORM_DATA,
	GENERIC_ERROR,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	SENDER_BACKGROUND_SCRIPT,
	SENDER_EXTENSION,
	SIGN_IN,
	SIGN_UP,
	UNKNOWN_ACTION
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

type CreateWindowPropertiesParams = {
	happId?: string;
	happName?: string;
	requireEmail?: boolean;
	requireRegistrationCode?: boolean;
};

const handleError = (sendResponse: SendResponseWithSender) => {
	windowId = undefined;
	sendResponse({ action: GENERIC_ERROR });
};

const createWindowProperties = ({
	happId,
	happName,
	requireEmail,
	requireRegistrationCode
}: CreateWindowPropertiesParams): WindowProperties => {
	const queryParams = createQueryParams({
		happId,
		happName,
		requireEmail,
		requireRegistrationCode
	});
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

const manageWindow = async (
	action: 'update' | 'create',
	windowProperties: WindowProperties,
	handleWindowUpdateOrCreate: () => Promise<void>
) => {
	const updateWindow = () =>
		chrome.windows.update(
			windowId!,
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

	action === 'update' ? updateWindow() : createWindow();
};

const updateOrCreateWindowCommon = async (
	handleWindowUpdateOrCreate: () => Promise<void>,
	params: CreateWindowPropertiesParams
) => {
	const windowProperties = createWindowProperties(params);
	const actionType = windowId ? 'update' : 'create';
	manageWindow(actionType, windowProperties, handleWindowUpdateOrCreate);
};

const updateOrCreateWindow = async (
	successAction: typeof NEEDS_SETUP,
	sendResponse: SendResponseWithSender
) => {
	const handleWindowUpdateOrCreate = async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);

		try {
			sendResponse({ action: successAction });
		} catch (error) {
			handleError(sendResponse);
		}
	};

	await updateOrCreateWindowCommon(handleWindowUpdateOrCreate, {});
};

const updateOrCreateWindowForSignUp = async (
	sendResponse: SendResponseWithSender,
	params: CreateWindowPropertiesParams
) => {
	const waitForFormSubmission = (): Promise<Message> =>
		new Promise((resolve) => {
			const messageListener = (
				message: Message,
				sender: chrome.runtime.MessageSender,
				sendResponse: SendResponse
			) => {
				if (message.sender !== SENDER_EXTENSION) return;
				sendResponse({
					action: BACKGROUND_SCRIPT_RECEIVED_FORM_DATA,
					sender: SENDER_BACKGROUND_SCRIPT
				});
				chrome.runtime.onMessage.removeListener(messageListener);
				resolve(message);
			};
			chrome.runtime.onMessage.addListener(messageListener);
		});

	const handleWindowUpdateOrCreate = async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);

		try {
			const message = await waitForFormSubmission();
			sendResponse(message);
		} catch (error) {
			handleError(sendResponse);
		}
	};

	await updateOrCreateWindowCommon(handleWindowUpdateOrCreate, params);
};

const processMessage = async (message: Message, sendResponse: SendResponse) => {
	const sendResponseWithSender = (response: ActionPayload) =>
		sendResponse({ ...response, sender: SENDER_BACKGROUND_SCRIPT });
	const parsedMessage = MessageWithIdSchema.safeParse(message);
	if (!parsedMessage.success) return;

	try {
		if (!(await isSetupComplete())) {
			return updateOrCreateWindow(NEEDS_SETUP, sendResponseWithSender);
		}

		switch (parsedMessage.data.action) {
			case SIGN_UP:
				return updateOrCreateWindowForSignUp(sendResponseWithSender, parsedMessage.data.payload);
			case SIGN_IN:
				if (!(await isAppSignUpComplete(parsedMessage.data.payload.happId))) {
					return sendResponseWithSender({ action: NO_KEY_FOR_HAPP });
				}
				break;
			default:
				return sendResponseWithSender({ action: UNKNOWN_ACTION });
		}
	} catch (error) {
		handleError(sendResponseWithSender);
	}
};

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse: SendResponse) => {
	processMessage(message, sendResponse);
	return true;
});
