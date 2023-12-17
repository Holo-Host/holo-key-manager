/* eslint-disable @typescript-eslint/no-var-requires */
// removeExportFromScript.cjs
const path = require('path');
const fs = require('fs');

function removeExportStatement(directory, fileName) {
	console.log('Removing "export {};" from script');
	const filePath = path.join(directory, fileName);
	let fileContent = fs.readFileSync(filePath, 'utf8');

	// Replace "export {};" with an empty string
	fileContent = fileContent.replace('export {};', '');

	fs.writeFileSync(filePath, fileContent);
	console.log(`"export {};" removed from: ${filePath}`);
}

removeExportStatement(path.resolve(__dirname, '../../build/scripts'), 'background.js');
