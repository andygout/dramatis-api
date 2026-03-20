import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node
			},
			ecmaVersion: 2020,
			sourceType: 'module'
		},
		rules: {
			'comma-dangle': 'error',
			eqeqeq: 'error',
			'guard-for-in': 'error',
			'new-cap': 'error',
			'no-caller': 'error',
			'no-console': 'error',
			'no-extend-native': 'error',
			'no-irregular-whitespace': 'error',
			'no-loop-func': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-undef': 'error',
			'no-underscore-dangle': 'error',
			'no-unused-vars': 'error',
			'no-var': 'error',
			'one-var': ['error', 'never'],
			quotes: ['error', 'single'],
			semi: 'error',
			'space-before-function-paren': 'error',
			'spaced-comment': 'error',
			strict: ['error', 'global'],
			'wrap-iife': 'error'
		}
	},
	eslintConfigPrettier
];
