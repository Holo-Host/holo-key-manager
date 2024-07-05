/* eslint-disable @typescript-eslint/no-var-requires */
// replaceForFirefox.cjs
const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../static/manifest.json');

const args = process.argv.slice(2);
const geckoId = args[0];

const exitWithError = (message) => {
	console.error(message);
	process.exit(1);
};

const updateManifest = (data, geckoId) => {
	const manifest = JSON.parse(data);
	const { key, ...rest } = manifest;
	return {
		...rest,
		background: {
			scripts: ['scripts/background.js'],
			type: 'module'
		},
		browser_specific_settings: {
			...manifest.browser_specific_settings,
			gecko: {
				id: geckoId
			}
		}
	};
};

const writeUpdatedManifest = (updatedManifest) => {
	fs.writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2), 'utf8', (err) => {
		if (err) {
			console.error('Error writing the manifest file:', err);
			return;
		}
		console.log('Manifest file updated successfully.');
	});
};

if (!geckoId) {
	exitWithError('Gecko ID is not provided as an argument.');
}

fs.readFile(manifestPath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the manifest file:', err);
		return;
	}
	const updatedManifest = updateManifest(data, geckoId);
	writeUpdatedManifest(updatedManifest);
});
