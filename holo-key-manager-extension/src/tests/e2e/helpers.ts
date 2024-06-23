import { Browser, launch, Page } from 'puppeteer';

export const launchBrowserWithExtension = async (extensionPath: string): Promise<Browser> => {
	return launch({
		headless: false,
		args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
	});
};

export const openExtensionPage = async (browser: Browser, extensionId: string): Promise<Page> => {
	const page = await browser.newPage();
	await page.goto(`chrome-extension://${extensionId}/index.html`);
	return page;
};

export const checkPageContent = async (page: Page, text: string): Promise<void> => {
	const content = await page.content();
	if (!content.includes(text)) {
		throw new Error(`${text} not found`);
	}
};

export const waitForLoadingToChange = async (page: Page): Promise<void> => {
	await page.waitForFunction(
		() => {
			const span = document.querySelector('span');
			return span && span.textContent ? !span.textContent.includes('Loading') : false;
		},
		{ timeout: 5000 }
	);
};
