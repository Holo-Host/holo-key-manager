/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const removeExportStatement = (directory, fileName) => {
	console.log(`Removing "export {};" from ${fileName}`);
	const filePath = path.join(directory, fileName);
	const fileContent = fs.readFileSync(filePath, 'utf8').replace('export {};', '');

	fs.writeFileSync(filePath, fileContent);
	console.log(`"export {};" removed from: ${filePath}`);
};

['background.js', 'content.js'].forEach((file) =>
	removeExportStatement(
		path.resolve(__dirname, '../build/holo-key-manager-extension/scripts'),
		file
	)
);
