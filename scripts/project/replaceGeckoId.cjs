/* eslint-disable @typescript-eslint/no-var-requires */
// replaceGeckoId.js
const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../../static/manifest.json');

const args = process.argv.slice(2);
const geckoId = args[0];

if (!geckoId) {
	console.error('Gecko ID is not provided as an argument.');
	process.exit(1);
}

fs.readFile(manifestPath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the manifest file:', err);
		return;
	}

	const manifest = JSON.parse(data);
	const updatedManifest = {
		...manifest,
		browser_specific_settings: {
			...manifest.browser_specific_settings,
			gecko: {
				id: geckoId
			}
		}
	};

	fs.writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2), 'utf8', (err) => {
		if (err) {
			console.error('Error writing the manifest file:', err);
			return;
		}

		console.log('Manifest file updated successfully.');
	});
});
