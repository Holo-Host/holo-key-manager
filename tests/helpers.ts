import express from 'express';
import { access, constants } from 'fs';
import type { Server } from 'http';
import { resolve } from 'path';
import { Browser, launch, Locator, Page } from 'puppeteer';
import nacl from 'tweetnacl';
import { vi } from 'vitest';

export const launchBrowserWithExtension = async (extensionPath: string): Promise<Browser> => {
	return launch({
		dumpio: true,
		headless: true,
		args: [
			`--disable-extensions-except=${extensionPath}`,
			`--load-extension=${extensionPath}`,
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	});
};

export const openExtensionPage = async (browser: Browser, extensionId: string): Promise<Page> => {
	const page = await browser.newPage();
	await page.goto(`chrome-extension://${extensionId}/index.html`);
	return page;
};

export const clickButtonAndWaitForNewPage = async (
	browser: Browser,
	button: Locator<Element>,
	downloadPath: string
): Promise<Page> => {
	await button.click();
	const newPage = await waitForNewPage(browser);

	const session = await newPage.createCDPSession();
	await session.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadPath
	});

	return newPage;
};

export const fileExists = (filePath: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const checkFile = () => {
			access(filePath, constants.F_OK, (err) => {
				if (!err) {
					resolve(true);
				} else {
					setTimeout(checkFile, 100);
				}
			});
		};
		checkFile();
	});
};

const findElementByText = (context: Page, selector: string) => async (text: string) => {
	const locator = context.locator(`${selector}::-p-text(${text})`);
	await locator.waitHandle();
	return locator;
};

export const findButtonExtensionByText = (context: Page) =>
	findElementByText(context, 'button:not(:disabled) > span');
export const findTextBySelector = (context: Page) => findElementByText(context, '');

export const startServer = (port: number = 3007): Server => {
	const app = express();
	app.use(express.static(resolve('./holo-key-manager-js-client')));
	return app.listen(port);
};

export const waitForNewPage = (browser: Browser): Promise<Page> =>
	new Promise((resolve, reject) =>
		browser.once('targetcreated', async (target) => {
			const page = await target.page();
			page ? resolve(page) : reject(new Error('Failed to create new page'));
		})
	);

export const apiEndpoints = {
	'data-object': { status: 200, contentType: 'application/json', body: JSON.stringify([]) },
	'register-key': { status: 200, contentType: 'application/json', body: JSON.stringify({}) }
} as const;

export const createSignUpExtensionPage = async (browser: Browser, buttonClick: () => void) => {
	const apiCallSpy = vi.fn();

	const newPagePromise = waitForNewPage(browser);

	buttonClick();

	const signUpExtensionPage = await newPagePromise;

	signUpExtensionPage.setRequestInterception(true);

	signUpExtensionPage.on('request', (request) => {
		const endpoint = Object.keys(apiEndpoints).find((key) =>
			request.url().includes(`key-manager-store.holo.host/api/v1/${key}`)
		);

		if (endpoint && endpoint in apiEndpoints) {
			if (endpoint === 'register-key') {
				apiCallSpy(JSON.parse(request.postData() ?? ''));
			}
			request.respond(apiEndpoints[endpoint as keyof typeof apiEndpoints]);
		} else {
			request.continue();
		}
	});

	return { apiCallSpy, signUpExtensionPage };
};

export const extractUint8ArrayFromResult = async (
	page: Page,
	id: string,
	key: string
): Promise<Uint8Array> => {
	const resultLocator = page.locator(`#${id}`);
	await resultLocator.wait();

	const resultText = await resultLocator.map((element) => element.textContent).wait();

	const match = resultText?.match(/successful: (.*)/);

	if (!match) {
		throw new Error(`Expected ${id} result not found in page content`);
	}

	const result = JSON.parse(match[1]);
	const array = Object.values(result[key]);
	return new Uint8Array(array as number[]);
};

export const validateSignature = (
	publicKey: Uint8Array,
	signedMessage: Uint8Array,
	originalMessage: Uint8Array
) => {
	const isValid = nacl.sign.detached.verify(originalMessage, signedMessage, publicKey);

	return isValid;
};
