import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = path.dirname(__filename); // eslint-disable-line no-underscore-dangle

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import mochaPlugin from 'eslint-plugin-mocha';
import globals from 'globals';

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends(
		'eslint:recommended',
		'plugin:mocha/recommended'
	),
	{
		languageOptions: {
			globals: {
				...globals.node
			},
			ecmaVersion: 2020,
			sourceType: 'module'
		},
		rules: {
			'comma-dangle': 2,
			eqeqeq: 2,
			'guard-for-in': 2,
			'new-cap': 2,
			'no-caller': 2,
			'no-console': 2,
			'no-extend-native': 2,
			'no-irregular-whitespace': 2,
			'no-loop-func': 2,
			'no-multi-spaces': 2,
			'no-multiple-empty-lines': [2, { max: 1 }],
			'no-undef': 2,
			'no-underscore-dangle': 2,
			'no-unused-vars': 2,
			'no-var': 2,
			'one-var': [2, 'never'],
			quotes: [2, 'single'],
			semi: 2,
			'space-before-function-paren': 2,
			'spaced-comment': 2,
			strict: [2, 'global'],
			'wrap-iife': 2
		}
	},
	{
		files: [
			'test-e2e/**/*.test.js',
			'test-int/**/*.test.js',
			'test-unit/**/*.test.js'
		],
		languageOptions: {
			globals: {
				...globals.mocha
			}
		},
		plugins: {
			mocha: mochaPlugin
		},
		rules: {
			'mocha/no-exclusive-tests': 2,
			'mocha/no-mocha-arrows': 0
		}
	}
];
