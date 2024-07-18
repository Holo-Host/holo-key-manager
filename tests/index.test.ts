import dotenv from 'dotenv';
import { rm } from 'fs/promises';
import { Server } from 'http';
import { resolve } from 'path';
import type { Browser } from 'puppeteer';
import { afterAll, beforeAll, describe, it } from 'vitest';

// import clientInteractionTest from './clientInteraction';
import { launchBrowserWithExtension, startServer } from './helpers';
import needsSetupTest from './needsSetup';
// import needsSetupTest from './needsSetup';
// import preventSignatureFromOtherOrigin from './preventSignatureFromOtherOrigin';
import setupFlowTest from './setupFlow';

dotenv.config();

const EXTENSION_ID = process.env.CHROME_ID || 'eggfhkdnfdhdpmkfpihjjbnncgmhihce';

const downloadPath = resolve('./downloads');

let browser: Browser;
let server: Server;

beforeAll(async () => {
	if (!EXTENSION_ID) {
		throw new Error('EXTENSION_ID is not set');
	}
	const extensionPath = resolve('holo-key-manager-extension', 'build');
	browser = await launchBrowserWithExtension(extensionPath);
	const version = await browser.version();
	console.log('Browser version:', version);
	server = startServer();
});

afterAll(async () => {
	await rm(downloadPath, { recursive: true, force: true });
	await browser?.close();
	server.close();
});

describe('End-to-End Tests for Extension and Client', () => {
	it('should not allow the client to interact with the extension before setup', async () => {
		await needsSetupTest(browser);
	});

	it('verify setup flow works as expected', async () => {
		if (!EXTENSION_ID) {
			throw new Error('EXTENSION_ID is not set');
		}
		await setupFlowTest(browser, EXTENSION_ID);
	});

	// it('should allow the client to interact with the extension after setup', async () => {
	// 	await clientInteractionTest(browser);
	// });

	// it('should prevent the malicious page from signing messages', async () => {
	// 	await preventSignatureFromOtherOrigin(browser);
	// });
});
