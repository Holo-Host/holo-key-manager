import dotenv from 'dotenv';
import { readFile, rm } from 'fs/promises';
import JSZip from 'jszip';
import { join, resolve } from 'path';
import type { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
	clickButtonAndWaitForNewPage,
	fileExists,
	findButtonByText,
	findTextBySelector,
	launchBrowserWithExtension,
	openExtensionPage
} from './helpers';

dotenv.config();

const EXTENSION_ID = process.env.CHROME_ID;

const downloadPath = resolve('./downloads');

let browser: Browser;
let page: Page;

beforeAll(async () => {
	if (!EXTENSION_ID) {
		throw new Error('EXTENSION_ID is not set');
	}
	const extensionPath = resolve('holo-key-manager-extension', 'build');
	browser = await launchBrowserWithExtension(extensionPath);
	page = await openExtensionPage(browser, EXTENSION_ID);
});

afterAll(async () => {
	await rm(downloadPath, { recursive: true, force: true });
	await browser?.close();
});

describe('Extension E2E Tests', () => {
	it('Setup flow is working properly', async () => {
		console.log('Finding Setup button');
		const setupButton = await findButtonByText(page)('Setup');

		console.log('Finding Setup Required text');
		const setupPageContent = await findTextBySelector(page)('Setup Required');

		expect(setupPageContent).toBeTruthy();

		console.log('Clicking Setup button and waiting for new page');
		const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton, downloadPath);

		const findButtonOnSetupPage = findButtonByText(setupPage);
		const findTextOnSetupPage = findTextBySelector(setupPage);

		console.log('Finding Holo Key Manager text');
		const setupPageText = await findTextOnSetupPage(
			'Holo Key Manager is a safe place to set up and manage keys for Holochain apps'
		);

		expect(setupPageText).toBeTruthy();

		console.log('Finding First time set up button');
		const firstTimeSetupButton = await findButtonOnSetupPage('First time set up');

		console.log('Clicking First time set up button and waiting for navigation');
		await Promise.all([setupPage.waitForNavigation(), firstTimeSetupButton.click()]);

		console.log('Finding Set Key Manager Password text');
		const setKeyManagerPasswordText = await findTextOnSetupPage('Set Key Manager Password');

		expect(setKeyManagerPasswordText).toBeTruthy();

		console.log('Typing enter-password');
		await setupPage.type('input[id*="enter-password"]', 'password');

		console.log('Typing confirm-password');
		await setupPage.type('input[id="confirm-password"]', 'password');

		console.log('Finding Set password button');
		const setPasswordButton = await findButtonOnSetupPage('Set password');

		console.log('Clicking Set password button and waiting for navigation');
		await Promise.all([setupPage.waitForNavigation(), setPasswordButton.click()]);

		console.log('Finding I understand button');
		const iUnderstandButton = await findButtonOnSetupPage('I understand');

		expect(iUnderstandButton).toBeTruthy();

		console.log('Clicking Set password button and waiting for navigation');
		await Promise.all([setupPage.waitForNavigation(), iUnderstandButton.click()]);

		console.log('Finding Enter Passphrase text');
		const enterPassphraseText = await findTextOnSetupPage('Enter Passphrase');

		expect(enterPassphraseText).toBeTruthy();

		console.log('Typing passphrase');
		await setupPage.type('textarea[placeholder="Enter Passphrase"]', 'passphrase passphrase');

		console.log('Finding Set passphrase button');
		const setPassphraseButton = await findButtonOnSetupPage('Set passphrase');

		console.log('Clicking Set passphrase button');
		await setPassphraseButton.click();

		console.log('Finding Confirm Passphrase text');
		const confirmPassphraseText = await findTextOnSetupPage('Confirm Passphrase');

		expect(confirmPassphraseText).toBeTruthy();

		console.log('Typing confirm passphrase');
		await setupPage.type('textarea[placeholder="Confirm Passphrase"]', 'passphrase passphrase');

		console.log('Finding Next button');
		const confirmPassphraseButton = await findButtonOnSetupPage('Next');

		console.log('Clicking Next button and waiting for navigation');
		await Promise.all([setupPage.waitForNavigation(), confirmPassphraseButton.click()]);

		console.log('Finding Generate seed and key files text');
		const generateSeedText = await findTextOnSetupPage('Generate seed and key files');

		expect(generateSeedText).toBeTruthy();

		console.log('Finding Generate button');
		const generateSeedButton = await findButtonOnSetupPage('Generate');

		console.log('Clicking Generate button and waiting for navigation');
		await Promise.all([setupPage.waitForNavigation(), generateSeedButton.click()]);

		console.log('Finding Save seed and key files text');
		const saveSeedText = await findTextOnSetupPage('Save seed and key files');

		expect(saveSeedText).toBeTruthy();

		console.log('Finding Save button');
		const exportButton = await findButtonOnSetupPage('Save');

		console.log('Clicking Export button');
		exportButton.click();

		console.log('Checking if keys file exists');
		const keysFilePath = join(downloadPath, 'keys.zip');
		const keysFileExists = await fileExists(keysFilePath);

		expect(keysFileExists).toBe(true);

		console.log('Reading keys file');
		const zipContent = await readFile(keysFilePath);
		const zip = await JSZip.loadAsync(zipContent);

		console.log('Checking keys file content');
		const expectedFiles = ['device.txt', 'master.txt', 'revocation.txt'];
		const actualFiles = Object.keys(zip.files);

		expectedFiles.forEach((file) => {
			expect(actualFiles).toContain(file);
		});

		console.log('Finding Setup Complete text');
		const setupCompleteText = await findTextOnSetupPage('Setup Complete');

		expect(setupCompleteText).toBeTruthy();
	}, 10000);
});
