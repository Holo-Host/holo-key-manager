import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import { findTextBySelector } from './helpers';

// import { findTextBySelector } from './helpers';

export default async function needsSetupTest(browser: Browser) {
	const page = await browser.newPage();
	await page.goto('http://localhost:3007/tests/test.html');

	// Find the service worker target
	const swTarget = await browser.waitForTarget((target) => target.type() === 'service_worker');

	// Create a new page for the service worker
	const swPage = await swTarget.createCDPSession();

	// Enable console logging for the service worker
	await swPage.send('Runtime.enable');

	// Listen for console messages from the service worker
	swPage.on('Runtime.consoleAPICalled', (event) => {
		const { type, args } = event;
		const formattedArgs = args.map((arg) => arg.value || arg.description).join(', ');
		console.log(`Service Worker Console [${type}]: ${formattedArgs}`);
	});

	await page.evaluate(() => {
		window.addEventListener('message', (event) => {
			console.log(event.data);
		});
	});

	page.on('console', async (message) => {
		const type = message.type();
		const text = await message.text();
		const args = await Promise.all(message.args().map((arg) => arg.jsonValue()));

		const formattedArgs = args.map((arg) => JSON.stringify(arg)).join(', ');
		console.log(
			`Console message [${type}]: ${text}${formattedArgs ? ` | Args: ${formattedArgs}` : ''}`
		);
	});

	const findTextOnPage = findTextBySelector(page);

	const signUpButton = await findTextOnPage('Sign Up');
	expect(signUpButton).toBeTruthy();

	expect(page).toBeTruthy();

	await signUpButton.click();

	const needsSetupText = await findTextOnPage('NeedsSetup');
	expect(needsSetupText).toBeTruthy();
}
