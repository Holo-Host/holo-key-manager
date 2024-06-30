import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			...tseslint.configs.rules,
			'@typescript-eslint/ban-ts-comment': 0,
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }]
		}
	},
	{
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		files: ['**/*.svelte', '*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			},
			globals: {
				...globals.webextensions,
				...globals.browser
			}
		}
	},
	{
		files: ['**/*.js'],
		...tseslint.configs.disableTypeChecked
	},
	{
		ignores: [
			'.DS_Store',
			'**/node_modules',
			'**/build/',
			'**/.svelte-kit',
			'holo-key-manager-js-client/lib/',
			'.env',
			'.env.*',
			'!.env.example',
			'.vscode',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},
	eslintPluginPrettierRecommended
];
