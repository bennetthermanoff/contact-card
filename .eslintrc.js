module.exports = {
	env: {
		browser: true,
		es2022: true, // Use es2022 instead of es2021
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
	],
	overrides: [
		{
			files: ['client/src/**/*.js', 'client/src/**/*.jsx', 'client/src/**/*.ts', 'client/src/**/*.tsx'],
			parserOptions: {
				sourceType: 'module', // Use 'module' for TypeScript files
				ecmaVersion: 2022, // Use a specific ES version
			},
			rules: {
				// Specific rules for client-side TypeScript files can be added here
			},
		},
		{
			files: ['server/**/*.js', 'server/**/*.ts',],
			env: {
				node: true,
			},
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2022,
			},
			rules: {
				// Specific rules for server-side TypeScript files can be added here
			},
		},
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'react-hooks'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
