import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

export default [
	{
		input: 'background.ts',
		output: {
			file: '../build/scripts/background.js',
			format: 'esm'
		},
		plugins: [
			tscAlias(),
			typescript(),
			nodePolyfills(),
			nodeResolve({ preferBuiltins: false }),
			commonjs()
		]
	},
	{
		input: 'content.ts',
		output: {
			file: '../build/scripts/content.js',
			format: 'esm'
		},
		plugins: [tscAlias(), typescript(), nodeResolve()]
	}
];
