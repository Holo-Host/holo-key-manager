import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
// import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

const createConfig = (input, file) => ({
	input,
	output: {
		file,
		format: 'esm'
	},
	plugins: [
		tscAlias(),
		nodePolyfills(),
		nodeResolve({ preferBuiltins: true }),
		commonjs(),
		inject({
			Buffer: ['buffer', 'Buffer']
		}),
		replace({
			preventAssignment: true,
			global: 'self',
			'global.': 'self.'
		}),
		typescript()
		// terser()
	]
});

export default [
	createConfig('background.ts', '../build/scripts/background.js'),
	createConfig('content.ts', '../build/scripts/content.js')
];
