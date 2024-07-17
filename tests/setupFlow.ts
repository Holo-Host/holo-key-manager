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
	console.log('Starting setup flow test');
	const page = await openExtensionPage(browser, EXTENSION_ID);

	console.log('Finding setup button');
	const setupButton = await findButtonExtensionByText(page)('Setup');

	console.log('Checking for setup page content');
	const setupPageContent = await findTextBySelector(page)('Setup Required');

	expect(setupPageContent).toBeTruthy();

	console.log('Clicking setup button and waiting for new page');
	const setupPage = await clickButtonAndWaitForNewPage(browser, setupButton, downloadPath);

	const findButtonOnSetupPage = findButtonExtensionByText(setupPage);
	const findTextOnSetupPage = findTextBySelector(setupPage);

	console.log('Verifying setup page text');
	const setupPageText = await findTextOnSetupPage(
		'Holo Key Manager is a safe place to set up and manage keys for Holochain apps'
	);

	expect(setupPageText).toBeTruthy();

	console.log('Clicking first time setup button');
	const firstTimeSetupButton = await findButtonOnSetupPage('First time set up');

	await Promise.all([setupPage.waitForNavigation(), firstTimeSetupButton.click()]);

	console.log('Verifying password setup page');
	const setKeyManagerPasswordText = await findTextOnSetupPage('Set Key Manager Password');

	expect(setKeyManagerPasswordText).toBeTruthy();

	console.log('Entering password');
	await setupPage.type('input[id*="enter-password"]', 'password');

	await setupPage.type('input[id="confirm-password"]', 'password');

	console.log('Setting password');
	const setPasswordButton = await findButtonOnSetupPage('Set password');

	await Promise.all([setupPage.waitForNavigation(), setPasswordButton.click()]);

	console.log('Clicking "I understand" button');
	const iUnderstandButton = await findButtonOnSetupPage('I understand');

	expect(iUnderstandButton).toBeTruthy();

	await Promise.all([setupPage.waitForNavigation(), iUnderstandButton.click()]);

	console.log('Verifying passphrase entry page');
	const enterPassphraseText = await findTextOnSetupPage('Enter Passphrase');

	expect(enterPassphraseText).toBeTruthy();

	console.log('Entering passphrase');
	await setupPage.type('textarea[placeholder="Enter Passphrase"]', 'passphrase passphrase');

	console.log('Setting passphrase');
	const setPassphraseButton = await findButtonOnSetupPage('Set passphrase');

	await setPassphraseButton.click();

	console.log('Verifying passphrase confirmation page');
	const confirmPassphraseText = await findTextOnSetupPage('Confirm Passphrase');

	expect(confirmPassphraseText).toBeTruthy();

	console.log('Confirming passphrase');
	await setupPage.type('textarea[placeholder="Confirm Passphrase"]', 'passphrase passphrase');

	const confirmPassphraseButton = await findButtonOnSetupPage('Next');

	await Promise.all([setupPage.waitForNavigation(), confirmPassphraseButton.click()]);

	console.log('Verifying seed generation page');
	const generateSeedText = await findTextOnSetupPage('Generate seed and key files');

	expect(generateSeedText).toBeTruthy();

	console.log('Generating seed');
	const generateSeedButton = await findButtonOnSetupPage('Generate');

	await Promise.all([setupPage.waitForNavigation(), generateSeedButton.click()]);

	console.log('Verifying seed saving page');
	const saveSeedText = await findTextOnSetupPage('Save seed and key files');

	expect(saveSeedText).toBeTruthy();

	console.log('Saving seed and key files');
	const exportButton = await findButtonOnSetupPage('Save');

	exportButton.click();

	console.log('Verifying downloaded keys file');
	const keysFilePath = join(downloadPath, 'keys.zip');
	const keysFileExists = await fileExists(keysFilePath);

	expect(keysFileExists).toBe(true);

	console.log('Checking contents of keys file');
	const zipContent = await readFile(keysFilePath);
	const zip = await JSZip.loadAsync(zipContent);

	const expectedFiles = ['device.txt', 'master.txt', 'revocation.txt'];
	const actualFiles = Object.keys(zip.files);

	expectedFiles.forEach((file) => {
		expect(actualFiles).toContain(file);
	});

	console.log('Verifying setup completion');
	const setupCompleteText = await findTextOnSetupPage('Setup Complete');

	return expect(setupCompleteText).toBeTruthy();
	console.log('Setup flow test completed successfully');
}
