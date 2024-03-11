import type { Message } from '@sharedTypes';

console.log('Content script loaded');
const isMessageFromSelf = (event: MessageEvent) => event.source === window;
const isSignInAction = (data: Message) => data.action === 'SignIn';

window.addEventListener('message', async (event: MessageEvent) => {
	if (!isMessageFromSelf(event)) return;
	if (isSignInAction(event.data)) {
		const response = await chrome.runtime.sendMessage(event.data);
		window.postMessage({ ...response, id: event.data.id }, '*');
	}
});
