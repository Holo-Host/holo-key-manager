import dotenv from 'dotenv';
import path from 'path';
import type { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
	clickButtonAndWaitForNewPage,
	launchBrowserWithExtension,
	openExtensionPage
} from './helpers';

dotenv.config();

const EXTENSION_ID = process.env.CHROME_ID;

let browser: Browser;
let page: Page;

beforeAll(async () => {
	if (!EXTENSION_ID) {
		throw new Error('EXTENSION_ID is not set');
	}
	const extensionPath = path.resolve('holo-key-manager-extension', 'build');
	browser = await launchBrowserWithExtension(extensionPath);
	page = await openExtensionPage(browser, EXTENSION_ID);
});

afterAll(async () => {
	await browser?.close();
});

describe('Extension E2E Tests', () => {
	it('Setup flow is working properly', async () => {
		const setupButton = await page.waitForSelector('button::-p-text("Setup")');

		expect(await page.content()).toContain('Setup Required');

		if (!setupButton) {
			throw new Error('Button not found');
		}
		const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton);

		const setupPageContent = await setupPage.content();

		expect(setupPageContent).toContain('Welcome to Holo Key Manager');

		const firstTimeSetupButton = await setupPage.waitForSelector(
			'button::-p-text("First time setup")'
		);

		if (!firstTimeSetupButton) {
			throw new Error('Button not found');
		}

		await Promise.all([setupPage.waitForNavigation(), firstTimeSetupButton.click()]);

		const firstTimeSetupPageContent = await setupPage.content();

		expect(firstTimeSetupPageContent).toContain('Set Key Manager Password');

		const newPasswordInput = await setupPage.waitForSelector('input[id*="new-password"]');
		const confirmPasswordInput = await setupPage.waitForSelector(
			'input[id="confirm-new-password"]'
		);

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

		expect(newPasswordInput).toBeDefined();
	}, 10000);
});
