/* eslint-disable @typescript-eslint/no-var-requires */
// prebuild.js

require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');

const configContent = `
export const browserConfig = {
    ChromeID: '${process.env.CHROME_ID}',
    FirefoxID: '${process.env.FF_ID}',
    EdgeID: '${process.env.EDGE_ID}'
};
`;

const configFile = path.resolve(__dirname, 'src', 'browserConfig.ts');
fs.writeFileSync(configFile, configContent, 'utf8');
