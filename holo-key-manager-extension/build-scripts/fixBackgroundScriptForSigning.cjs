/* eslint-disable @typescript-eslint/no-var-requires */
// replaceForFirefox.cjs
const fs = require('fs');
const path = require('path');
const backgroundScriptPath = path.resolve(__dirname, '../build/scripts/background.js');

fs.readFile(backgroundScriptPath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the background script file:', err);
		return;
	}

	let modifiedData = data.replace(/global\./g, 'self.');

	modifiedData = modifiedData.replace(
		/var normalize = bufferUtil\.normalize;/g,
		`var normalize = function (buffer) {
	if (Buffer.isBuffer(buffer)) return buffer;
	return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};`
	);

	fs.writeFile(backgroundScriptPath, modifiedData, 'utf8', (err) => {
		if (err) {
			console.error('Error writing the modified background script file:', err);
			return;
		}

		console.log('Background script file modified successfully.');
	});
});
