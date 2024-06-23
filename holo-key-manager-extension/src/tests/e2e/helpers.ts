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

export const clickButtonAndWaitForNewPage = async (
	browser: Browser,
	button: ElementHandle<Element>
): Promise<Page> => {
	await button?.click();

	const newPagePromise = new Promise<Page | null>((resolve) =>
		browser.once('targetcreated', async (target) => resolve(await target.page()))
	);

	const newPage = await newPagePromise;
	if (!newPage) {
		throw new Error('Failed to create new page');
	}
	await newPage.waitForNavigation();

	return newPage;
};
