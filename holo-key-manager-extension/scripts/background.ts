/* eslint-disable simple-import-sort/imports */
import './bootstrap.js';
/* eslint-disable simple-import-sort/imports */
import { signMessageLogic } from './helpers';

import {
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	GENERIC_ERROR,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	NOT_AUTHENTICATED,
	SENDER_BACKGROUND_SCRIPT,
	SENDER_EXTENSION,
	SIGN_IN,
	SIGN_MESSAGE,
	SIGN_MESSAGE_SUCCESS,
	SIGN_OUT,
	SIGN_OUT_SUCCESS,
	SIGN_UP,
	UNKNOWN_ACTION
} from '@shared/const';
import { createQueryParams } from '@shared/helpers';
import { isAppSignUpComplete, isAuthenticated, isSetupComplete, signOut } from '@shared/services';
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

const createWindowProperties = (actionPayload?: ActionPayload): WindowProperties => ({
	url: `webapp-extension/setup.html${actionPayload ? `?${createQueryParams(actionPayload)}` : ''}`,
	type: 'popup',
	height: 500,
	width: 375,
	top: 100,
	left: 1100
});

const updateWindow = (
	windowProperties: WindowProperties,
	handleWindowUpdateOrCreate: () => Promise<void>
) =>
	chrome.windows.update(
		windowId!,
		{ ...windowProperties, focused: true },
		handleWindowUpdateOrCreate
	);

const createWindow = (
	windowProperties: WindowProperties,
	handleWindowUpdateOrCreate: () => Promise<void>
) =>
	chrome.windows.create(windowProperties, (newWindow) => {
		if (!newWindow) return;
		windowId = newWindow.id;
		chrome.windows.onRemoved.addListener((id) => {
			if (id === windowId) windowId = undefined;
		});
		handleWindowUpdateOrCreate();
	});

const manageWindow = (
	windowProperties: WindowProperties,
	handleWindowUpdateOrCreate: () => Promise<void>
) =>
	windowId
		? updateWindow(windowProperties, handleWindowUpdateOrCreate)
		: createWindow(windowProperties, handleWindowUpdateOrCreate);

const updateOrCreateWindowCommon = (
	handleWindowUpdateOrCreate: () => Promise<void>,
	actionPayload?: ActionPayload
) => manageWindow(createWindowProperties(actionPayload), handleWindowUpdateOrCreate);

const updateOrCreateWindow = (
	successAction: typeof NEEDS_SETUP,
	sendResponse: SendResponseWithSender
) =>
	updateOrCreateWindowCommon(async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);

		try {
			sendResponse({ action: successAction });
		} catch (error) {
			handleError(sendResponse);
		}
	});

const waitForFormSubmission = (): Promise<Message> =>
	new Promise((resolve) => {
		const messageListener = (
			message: Message,
			sender: chrome.runtime.MessageSender,
			sendResponse: SendResponse
		) => {
			if (message.sender !== SENDER_EXTENSION) return;
			sendResponse({
				action: BACKGROUND_SCRIPT_RECEIVED_DATA,
				sender: SENDER_BACKGROUND_SCRIPT
			});
			chrome.runtime.onMessage.removeListener(messageListener);
			resolve(message);
		};
		chrome.runtime.onMessage.addListener(messageListener);
	});

const createOrUpdateDataResponseWindow = (
	sendResponse: SendResponseWithSender,
	actionPayload: ActionPayload
) =>
	updateOrCreateWindowCommon(async () => {
		if (chrome.runtime.lastError) return handleError(sendResponse);

		try {
			const message = await waitForFormSubmission();
			sendResponse(message);
		} catch (error) {
			handleError(sendResponse);
		}
	}, actionPayload);

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
				return createOrUpdateDataResponseWindow(sendResponseWithSender, {
					action: parsedMessage.data.action,
					payload: parsedMessage.data.payload
				});
			case SIGN_IN:
				return (await isAppSignUpComplete(parsedMessage.data.payload.happId))
					? createOrUpdateDataResponseWindow(sendResponseWithSender, {
							action: parsedMessage.data.action,
							payload: parsedMessage.data.payload
						})
					: sendResponseWithSender({ action: NO_KEY_FOR_HAPP });
			case SIGN_MESSAGE:
				if (await isAuthenticated(parsedMessage.data.payload.happId)) {
					console.log('parsedMessage.data.payload:', parsedMessage.data.payload);
					try {
						const signedMessage = await signMessageLogic(parsedMessage.data.payload);
						return sendResponseWithSender({
							action: SIGN_MESSAGE_SUCCESS,
							payload: signedMessage
						});
					} catch (error) {
						console.log('error:', error);
					}
				}
				return sendResponseWithSender({ action: NOT_AUTHENTICATED });
			case SIGN_OUT:
				signOut(parsedMessage.data.payload.happId);
				return sendResponseWithSender({ action: SIGN_OUT_SUCCESS });
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
