/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const buildDir = path.resolve(__dirname, '../build');
const firefoxDir = path.join(buildDir, 'firefox');

// Copy build directory to firefox directory
const copyDir = (src, dest) => execSync(`cp -r ${src} ${dest}`);

// Update manifest for Firefox
const updateManifestForFirefox = (directory) => {
	const manifestPath = path.join(directory, 'manifest.json');
	const data = fs.readFileSync(manifestPath, 'utf8');
	const { key, ...manifest } = JSON.parse(data);
	const updatedManifest = {
		...manifest,
		background: {
			scripts: ['scripts/background.js'],
			type: 'module'
		}
	};
	fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2), 'utf8');
};

// Archive directory
const archiveDirectory = (sourceDir, outPath) => {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(outPath);

	return new Promise((resolve, reject) => {
		archive
			.directory(sourceDir, false)
			.on('error', (err) => reject(err))
			.pipe(stream);

		stream.on('close', () => resolve());
		archive.finalize();
	});
};

const buildForFirefox = async () => {
	// Ensure firefox directory does not exist
	if (fs.existsSync(firefoxDir)) {
		execSync(`rm -rf ${firefoxDir}`);
	}

	// Copy build directory to firefox directory
	copyDir(buildDir, firefoxDir);

	updateManifestForFirefox(firefoxDir);

	// Archive firefox directory
	await archiveDirectory(firefoxDir, path.join(buildDir, 'firefox.zip'));

	// Remove firefox directory
	execSync(`rm -rf ${firefoxDir}`);

	console.log('Firefox build is ready and archived.');
};

buildForFirefox();
