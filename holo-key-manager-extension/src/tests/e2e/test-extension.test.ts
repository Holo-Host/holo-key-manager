import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
	clickButtonAndWaitForNewPage,
	launchBrowserWithExtension,
	openExtensionPage
} from './helpers';

const envPath = path.resolve('../.env');

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const EXTENSION_ID = process.env.CHROME_ID;

let browser: Browser;
let page: Page;

beforeAll(async () => {
	if (!EXTENSION_ID) {
		throw new Error('EXTENSION_ID is not set');
	}
	const extensionPath = path.resolve('.', 'build');
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
	});
});
