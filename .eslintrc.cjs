module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
		webextensions: true
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': 0,
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	}
};
