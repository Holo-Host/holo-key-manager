import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import wasm from '@rollup/plugin-wasm';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

export default [
	{
		input: 'background.ts',
		output: {
			dir: '../build/scripts/',
			format: 'esm'
		},
		plugins: [
			nodePolyfills(),
			tscAlias(),
			typescript(),
			nodeResolve({ preferBuiltins: false }),
			commonjs(),
			wasm()
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
