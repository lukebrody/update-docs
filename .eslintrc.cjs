module.exports = {
	'env': {
		'es2021': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 'latest',
		'sourceType': 'module',
		'project': 'tsconfig.lint.json',
		'tsconfigRootDir': __dirname
	},
	'plugins': [
		'react',
		'@typescript-eslint'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/strict-boolean-expressions': 'error',
		'@typescript-eslint/ban-types': [
			'error',
			{
				'types': {
					'{}': false
				},
				'extendDefaults': true
			}
		],
		'no-constant-condition': 'off'
	},
}
