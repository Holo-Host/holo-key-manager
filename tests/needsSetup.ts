import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import { findTextBySelector } from './helpers';

// import { findTextBySelector } from './helpers';

export default async function needsSetupTest(browser: Browser) {
	const page = await browser.newPage();
	await page.goto('http://localhost:3007/tests/test.html');

	const findTextOnPage = findTextBySelector(page);

	const signUpButton = await findTextOnPage('Sign Up');
	expect(signUpButton).toBeTruthy();

	expect(page).toBeTruthy();

	await signUpButton.click();

	await new Promise((resolve) => setTimeout(resolve, 2000));

	const pageContent = await page.content();
	console.log(pageContent);

	const needsSetupText = await findTextOnPage('NeedsSetup');
	expect(needsSetupText).toBeTruthy();
}
