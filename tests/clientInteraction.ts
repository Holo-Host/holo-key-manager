import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import {
	createSignUpExtensionPage,
	extractUint8ArrayFromResult,
	findButtonExtensionByText,
	findTextBySelector,
	validateSignature
} from './helpers';

export default async function clientInteractionTest(browser: Browser) {
	const appPage = await browser.newPage();
	await appPage.goto('http://localhost:5000/tests/test.html');

	const findTextOnAppPage = findTextBySelector(appPage);

	const signUpButton = await findTextOnAppPage('Sign Up');
	expect(signUpButton).toBeTruthy();

	const { apiCallSpy, signUpExtensionPage } = await createSignUpExtensionPage(browser, () =>
		signUpButton.click()
	);

	expect(signUpExtensionPage).toBeTruthy();

	const findTextOnSignUpExtensionPage = findTextBySelector(signUpExtensionPage);
	const findButtonOnSignUpExtensionPage = findButtonExtensionByText(signUpExtensionPage);

	const saveSeedText = await findTextOnSignUpExtensionPage(
		'Please enter your password to login into Holo Key Manager'
	);

	expect(saveSeedText).toBeTruthy();

	await signUpExtensionPage.type('input[id="enter-password"]', 'password');

	const loginButton = await findButtonOnSignUpExtensionPage('Login');

	await loginButton.click();

	const connectButton = await findButtonOnSignUpExtensionPage('Connect');

	expect(connectButton).toBeTruthy();

	await Promise.all([signUpExtensionPage.waitForNavigation(), connectButton.click()]);

	const requestDetailsText = await findTextOnSignUpExtensionPage(
		'This app is requesting the following details'
	);

	expect(requestDetailsText).toBeTruthy();

	await signUpExtensionPage.type('input[id*="email"]', 'test@test.com');
	await signUpExtensionPage.type('input[id*="name-this-key"]', 'Test1');

	const createButton = await findButtonOnSignUpExtensionPage('Create');

	expect(createButton).toBeTruthy();

	await Promise.all([
		createButton.click(),
		new Promise((resolve) => signUpExtensionPage.once('close', resolve))
	]);

	expect(apiCallSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			appIndex: 1,
			keyName: 'Test1'
		})
	);

	const pubKey = await extractUint8ArrayFromResult(appPage, 'signUpBtnResult', 'pubKey');
	expect(pubKey).toBeInstanceOf(Uint8Array);
	expect(pubKey.length).toBe(32);

	const messageInput = '[1,2,3]';

	await appPage.type('input[id="messageInput"]', messageInput);

	const signMessageBtn = await findTextOnAppPage('Sign Message');
	expect(signMessageBtn).toBeTruthy();

	await signMessageBtn.click();

	await new Promise((resolve) => setTimeout(resolve, 2000));

	const signedMessage = await extractUint8ArrayFromResult(
		appPage,
		'signMessageBtnResult',
		'signedMessage'
	);

	expect(signedMessage).toBeInstanceOf(Uint8Array);
	expect(signedMessage.length).toBe(64);

	const result = validateSignature(pubKey, signedMessage, new Uint8Array(JSON.parse(messageInput)));

	expect(result).toBe(true);
}
