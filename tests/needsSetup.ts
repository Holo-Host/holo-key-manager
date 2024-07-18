import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import { findTextBySelector } from './helpers';

// import { findTextBySelector } from './helpers';

export default async function needsSetupTest(browser: Browser) {
	const page = await browser.newPage();
	await page.goto('http://localhost:3007/tests/test.html');

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
