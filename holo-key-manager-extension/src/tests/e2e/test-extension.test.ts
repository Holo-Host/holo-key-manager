import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { launchBrowserWithExtension, openExtensionPage, waitForLoadingToChange } from './helpers';

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
	await waitForLoadingToChange(page);
});

afterAll(async () => {
	await browser?.close();
});

describe('Extension E2E Tests', () => {
	it('should find "Setup Required" text on the extension page', async () => {
		const content = await page.content();
		expect(content).toContain('Setup Required');
	});
});
