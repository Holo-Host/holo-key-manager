import { Browser } from 'puppeteer';
import { expect } from 'vitest';

// import { findTextBySelector } from './helpers';

export default async function needsSetupTest(browser: Browser) {
	const page = await browser.newPage();
	await page.goto('http://localhost:3007/tests/test.html');

	console.log(await page.content());

	expect(page).toBeTruthy();

	// const findTextOnPage = findTextBySelector(page);

	// const signUpButton = await findTextOnPage('Sign Up');
	// expect(signUpButton).toBeTruthy();

	// await signUpButton.click();

	// const needsSetupText = await findTextOnPage('NeedsSetup');
	// expect(needsSetupText).toBeTruthy();
}