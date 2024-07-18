import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import { startServer } from './helpers';

export default async function preventSignatureFromOtherOrigin(browser: Browser) {
	const server = startServer(3008);

	const maliciousPage = await browser.newPage();
	await maliciousPage.goto('http://localhost:3008');

	try {
		const result = await maliciousPage.evaluate(async () => {
			const message = new Uint8Array([1, 2, 3]);
			const messageId = Date.now().toString();

			return new Promise((resolve, reject) => {
				const responseHandler = (event: MessageEvent) => {
					if (event.data.id === messageId && event.data.sender !== 'webapp') {
						window.removeEventListener('message', responseHandler);
						resolve(event.data);
					}
				};

				window.addEventListener('message', responseHandler);

				window.postMessage(
					{
						action: 'SignMessage',
						id: messageId,
						payload: {
							message: message.toString(),
							happId: 'your-happId'
						},
						sender: 'webapp',
						appId: 'holo-key-manager'
					},
					'*'
				);
				setTimeout(() => {
					window.removeEventListener('message', responseHandler);
					reject(new Error('Timeout: No response received'));
				}, 5000);
			});
		});

		const isValidResult = (result: unknown): result is { action: string } =>
			typeof result === 'object' && result !== null && 'action' in result;

		if (isValidResult(result)) {
			expect(result.action).toBe('AppNotAuthenticated');
		} else {
			throw new Error('Unexpected result structure');
		}
	} finally {
		await maliciousPage.close();
		server.close();
	}
}
