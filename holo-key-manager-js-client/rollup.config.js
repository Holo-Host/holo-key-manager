import resolve from '@rollup/plugin-node-resolve';
import tscAlias from 'rollup-plugin-tsc-alias';
import typescript from 'rollup-plugin-typescript2';

export default [
	{
		input: 'src/index.ts',
		output: {
			file: 'lib/index.js',
			format: 'esm'
		},
		plugins: [typescript(), resolve(), tscAlias()]
	}
];
