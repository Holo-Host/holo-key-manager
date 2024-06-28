import { access, constants } from 'fs';
import { Browser, ElementHandle, launch, Page } from 'puppeteer';

export const launchBrowserWithExtension = async (extensionPath: string): Promise<Browser> => {
	return launch({
		headless: true,
		args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
	});
};

export const openExtensionPage = async (browser: Browser, extensionId: string): Promise<Page> => {
	const page = await browser.newPage();
	await page.goto(`chrome-extension://${extensionId}/index.html`);
	return page;
};

const waitForNewPage = (browser: Browser): Promise<Page> =>
	new Promise((resolve, reject) =>
		browser.once('targetcreated', async (target) => {
			const page = await target.page();
			page ? resolve(page) : reject(new Error('Failed to create new page'));
		})
	);

export const clickButtonAndWaitForNewPage = async (
	browser: Browser,
	button: ElementHandle<Element>,
	downloadPath: string
): Promise<Page> => {
	await button?.click();
	const newPage = await waitForNewPage(browser);
	await newPage.waitForNavigation();

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
