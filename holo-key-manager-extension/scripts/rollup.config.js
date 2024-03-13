import resolve from '@rollup/plugin-node-resolve';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

const createConfig = (input, file) => ({
	input,
	output: {
		file,
		format: 'esm'
	},
	plugins: [tscAlias(), typescript(), resolve()]
});

export default [
	createConfig('background.ts', '../build/scripts/background.js'),
	createConfig('content.ts', '../build/scripts/content.js')
];
