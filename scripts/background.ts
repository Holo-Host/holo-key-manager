import type { Message } from '../common/types/message';

let windowId: number | undefined;

const handleError = (error: string, sendResponse: (response?: Message) => void) => {
	console.error(error);
	windowId = undefined;
	sendResponse({ action: 'GenericError' });
};

const handleSuccess = (sendResponse: (response?: Message) => void, payload?: string) => {
	sendResponse(payload ? { action: 'SuccessWithPayload', payload } : { action: 'Success' });
};

const focusWindow = (sendResponse: (response?: Message) => void) => {
	if (typeof windowId !== 'number') return handleError('Window ID is not a number', sendResponse);
	chrome.windows.update(windowId, { focused: true }, () => {
		chrome.runtime.lastError
			? handleError('Error focusing window: ' + chrome.runtime.lastError.message, sendResponse)
			: handleSuccess(sendResponse);
	});
};

const createWindow = () => {
	chrome.windows.create(
		{ url: 'sign.html', type: 'popup', height: 500, width: 375, top: 100, left: 1100 },
		(newWindow) => {
			if (!newWindow) return;
			windowId = newWindow.id;
			chrome.windows.onRemoved.addListener((id) => {
				if (id === windowId) windowId = undefined;
			});
		}
	);
};

const signInHandler = async (sendResponse: (response?: Message) => void) => {
	if (windowId !== undefined) {
		focusWindow(sendResponse);
		return;
	}
	try {
		createWindow();
		// const deviceKey = await storageService.getWithoutCallback({ key: DEVICE_KEY, area: 'local' });
		// if (typeof deviceKey === 'string') {
		// 	handleSuccess(sendResponse, deviceKey);
		// } else {
		// 	handleError('Device key is not a string', sendResponse);
		// }
		chrome.storage.local.get(['deviceKey'], (result) => {
			handleSuccess(sendResponse, result.deviceKey);
		});
	} catch (error) {
		handleError(
			'Error creating window: ' + (error instanceof Error ? error.message : String(error)),
			sendResponse
		);
	}
};

chrome.runtime.onMessageExternal.addListener(
	(message: Message, sender, sendResponse: (response?: Message) => void) => {
		if (message.action === 'SignIn') signInHandler(sendResponse);
	}
);
