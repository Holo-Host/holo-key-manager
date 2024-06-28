import dotenv from 'dotenv';
import { readFile, rm } from 'fs/promises';
import JSZip from 'jszip';
import { join, resolve } from 'path';
import type { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
	clickButtonAndWaitForNewPage,
	fileExists,
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
		const setupButton = await page.waitForSelector('button::-p-text("Setup")');

		expect(await page.content()).toContain('Setup Required');

		if (!setupButton) {
			throw new Error('Button not found');
		}

		const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton, downloadPath);

		const setupPageContent = await setupPage.content();

		expect(setupPageContent).toContain(
			'Holo Key Manager is a safe place to set up and manage keys for Holochain apps'
		);

		const firstTimeSetupButton = await setupPage.waitForSelector(
			'button::-p-text("First time set up")'
		);

		if (!firstTimeSetupButton) {
			throw new Error('Button not found');
		}

		await Promise.all([setupPage.waitForNavigation(), firstTimeSetupButton.click()]);

		const firstTimeSetupPageContent = await setupPage.content();

		expect(firstTimeSetupPageContent).toContain('Set Key Manager Password');

		const newPasswordInput = await setupPage.waitForSelector('input[id*="enter-password"]');
		const confirmPasswordInput = await setupPage.waitForSelector('input[id="confirm-password"]');

		if (!newPasswordInput || !confirmPasswordInput) {
			throw new Error('Password inputs not found');
		}

		await newPasswordInput.type('password');
		await confirmPasswordInput.type('password');

		const setPasswordButton = await setupPage.waitForSelector('button::-p-text("Set password")');

		if (!setPasswordButton) {
			throw new Error('Button not found');
		}

		await Promise.all([setupPage.waitForNavigation(), setPasswordButton.click()]);

		const enterPassphrasePageContent = await setupPage.content();

		expect(enterPassphrasePageContent).toContain('Enter Passphrase');

		const enterPassphraseInput = await setupPage.waitForSelector(
			'textarea[placeholder="Enter Passphrase"]'
		);
		if (!enterPassphraseInput) {
			throw new Error('Password inputs not found');
		}

		await enterPassphraseInput.type('passphrase passphrase');

		const setPassphraseButton = await setupPage.waitForSelector(
			'button::-p-text("Set passphrase")'
		);

		if (!setPassphraseButton) {
			throw new Error('Button not found');
		}

		await setPassphraseButton.click();

		const confirmPassphrasePageContent = await setupPage.content();

		expect(confirmPassphrasePageContent).toContain('Confirm Passphrase');

		const confirmPassphraseInput = await setupPage.waitForSelector(
			'textarea[placeholder="Confirm Passphrase"]'
		);

		if (!confirmPassphraseInput) {
			throw new Error('Password inputs not found');
		}

		await confirmPassphraseInput.type('passphrase passphrase');

		const confirmPassphraseButton = await setupPage.waitForSelector('button::-p-text("Next")');

		if (!confirmPassphraseButton) {
			throw new Error('Button not found');
		}

		await Promise.all([setupPage.waitForNavigation(), confirmPassphraseButton.click()]);

		const generateSeedPageContent = await setupPage.content();

		expect(generateSeedPageContent).toContain('Generate seed and key files');

		const generateButton = await setupPage.waitForSelector('button::-p-text("Generate")');

		if (!generateButton) {
			throw new Error('Button not found');
		}

		await Promise.all([setupPage.waitForNavigation(), generateButton.click()]);

		const saveSeedPageContent = await setupPage.content();

		expect(saveSeedPageContent).toContain('Save seed and key files');

		const exportButton = await setupPage.waitForSelector('button::-p-text("Export")');

		if (!exportButton) {
			throw new Error('Button not found');
		}

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

		const setupCompletePageContent = await setupPage.content();

		expect(setupCompletePageContent).toContain('Setup Complete');
	}, 10000);
});
