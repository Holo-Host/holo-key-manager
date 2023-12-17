import type { Message } from '../../types/index';

console.log('background script loaded');

chrome.runtime.onMessageExternal.addListener((message: Message, sender, sendResponse) => {
	if (message.action === 'openWindow') {
		try {
			chrome.windows.create({
				url: 'sign.html',
				type: 'popup',
				height: 600,
				width: 375,
				top: 0,
				left: screen.width - 375
			});
		} catch (error) {
			console.error('Error creating window:', error);
			return;
		}
		sendResponse({ success: true, message: 'Window opened' });
	}
});
