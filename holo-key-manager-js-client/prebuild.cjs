/* eslint-disable @typescript-eslint/no-var-requires */
// prebuild.js

require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');

const generateConfigContent = () => `
export const browserConfig = {
    ChromeID: '${process.env.CHROME_ID}',
    FirefoxID: '${process.env.FF_ID}',
    EdgeID: '${process.env.EDGE_ID}'
};
`;

const configFile = path.resolve(__dirname, 'src', 'browserConfig.ts');

const writeConfigFile = (filePath, content) => {
	if (fs.existsSync(filePath)) {
		console.log('browserConfig exists, overriding...');
	}
	fs.writeFile(filePath, content, 'utf8', (err) => {
		if (err) throw err;
		console.log('browserConfig.ts has been saved!');
	});
};

writeConfigFile(configFile, generateConfigContent());
