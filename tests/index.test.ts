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
		const setupButton = await findButtonByText(page)('Setup');

		const setupPageContent = await findTextBySelector(page)('Setup Required');

		expect(setupPageContent).toBeTruthy();

		const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton, downloadPath);

		const findButtonOnSetupPage = findButtonByText(setupPage);
		const findTextOnSetupPage = findTextBySelector(setupPage);

		const setupPageText = await findTextOnSetupPage(
			'Holo Key Manager is a safe place to set up and manage keys for Holochain apps'
		);

		expect(setupPageText).toBeTruthy();

		const firstTimeSetupButton = await findButtonOnSetupPage('First time set up');

		await Promise.all([setupPage.waitForNavigation(), firstTimeSetupButton.click()]);
		const setKeyManagerPasswordText = await findTextOnSetupPage('Set Key Manager Password');

		expect(setKeyManagerPasswordText).toBeTruthy();

		await setupPage.type('input[id*="enter-password"]', 'password');
		await setupPage.type('input[id="confirm-password"]', 'password');

		const setPasswordButton = await findButtonOnSetupPage('Set password');

		await Promise.all([setupPage.waitForNavigation(), setPasswordButton.click()]);

		const enterPassphraseText = await findTextOnSetupPage('Enter Passphrase');
		expect(enterPassphraseText).toBeTruthy();

		await setupPage.type('textarea[placeholder="Enter Passphrase"]', 'passphrase passphrase');

		const setPassphraseButton = await findButtonOnSetupPage('Set passphrase');

		await setPassphraseButton.click();

		const confirmPassphraseText = await findTextOnSetupPage('Confirm Passphrase');
		expect(confirmPassphraseText).toBeTruthy();

		await setupPage.type('textarea[placeholder="Confirm Passphrase"]', 'passphrase passphrase');

		const confirmPassphraseButton = await findButtonOnSetupPage('Next');

		await Promise.all([setupPage.waitForNavigation(), confirmPassphraseButton.click()]);

		const generateSeedText = await findTextOnSetupPage('Generate seed and key files');

		expect(generateSeedText).toBeTruthy();

		const generateSeedButton = await findButtonOnSetupPage('Generate');

		await Promise.all([setupPage.waitForNavigation(), generateSeedButton.click()]);

		const saveSeedText = await findTextOnSetupPage('Save seed and key files');

		expect(saveSeedText).toBeTruthy();

		const exportButton = await findButtonOnSetupPage('Export');

		exportButton.click();

		const keysFilePath = join(downloadPath, 'keys.zip');

		const keysFileExists = await fileExists(keysFilePath);

		expect(keysFileExists).toBe(true);

		const zipContent = await readFile(keysFilePath);
		const zip = await JSZip.loadAsync(zipContent);

		const expectedFiles = ['device.txt', 'master.txt', 'revocation.txt'];
		const actualFiles = Object.keys(zip.files);

		expectedFiles.forEach((file) => {
			expect(actualFiles).toContain(file);
		});

		const setupCompleteText = await findTextOnSetupPage('Setup Complete');

		expect(setupCompleteText).toBeTruthy();
	}, 10000);
});
