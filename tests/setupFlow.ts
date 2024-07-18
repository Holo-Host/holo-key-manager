import { readFile } from 'fs/promises';
import JSZip from 'jszip';
import { join, resolve } from 'path';
import { Browser } from 'puppeteer';
import { expect } from 'vitest';

import {
	clickButtonAndWaitForNewPage,
	fileExists,
	findButtonExtensionByText,
	findTextBySelector,
	openExtensionPage
} from './helpers';

const downloadPath = resolve('./downloads');

export default async function setupFlowTest(browser: Browser, EXTENSION_ID: string) {
	if (!EXTENSION_ID) {
		throw new Error('EXTENSION_ID is not set');
	}

	const page = await openExtensionPage(browser, EXTENSION_ID);

	const targets = browser.targets();
	console.log(targets);
	const serviceWorkerTarget = targets.find((target) => target.type() === 'service_worker');

	if (serviceWorkerTarget) {
		console.log('Service worker from this extension is working');
	} else {
		console.log('Service worker from this extension is not detected');
	}

	const setupButton = await findButtonExtensionByText(page)('Setup');

	const setupPageContent = await findTextBySelector(page)('Setup Required');

	expect(setupPageContent).toBeTruthy();

	const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton, downloadPath);

	const findButtonOnSetupPage = findButtonExtensionByText(setupPage);
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

	const iUnderstandButton = await findButtonOnSetupPage('I understand');

	expect(iUnderstandButton).toBeTruthy();

	await Promise.all([setupPage.waitForNavigation(), iUnderstandButton.click()]);

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

	const exportButton = await findButtonOnSetupPage('Save');

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
}
