module.exports = {
	"env": {
		"node": true,
		"es6": true,
		"jest": true,
		"jasmine": true,
	},

	"extends": [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:vue/recommended"
	],

	"plugins": [
		"import",
		"vue"
	],

	"parserOptions": {
		"parser": "babel-eslint"
	},

	"rules": {
		"import/no-unresolved": [2, {commonjs: true, amd: true}],
		"no-underscore-dangle": 0,
		"arrow-body-style": 0,
		"import/no-extraneous-dependencies": 1,
		"import/imports-first": 0,
		"no-console": 1,
		"no-restricted-syntax": 0,
		"global-require": 0,
		"import/no-dynamic-require": 0,
		"import/prefer-default-export": 0,
		"no-use-before-define": 0,
		"no-param-reassign": 0,
		"func-names": 0,
		"vue/html-indent": [
			"error",
			4
		],
		"vue/html-self-closing": [
			"error", {
				"html": {
					"void": "any",
					"normal": "any",
					"component": "any"
				}
			}
		],
		"vue/v-bind-style": [
			"error",
			"longform"
		],
		"vue/max-attributes-per-line": [
			"error",
			{
				"multiline": {
					"allowFirstLine": true
				}
			}
		],
		"vue/v-on-style": [
			"error",
			"longform"
		],
		"vue/singleline-html-element-content-newline": "off"
	},

	"overrides": [
		{
			"files": [
				"scripts/**/*.js",
				"migrations/**/*.js"
			],
			"rules": {
				"no-console": 0
			}
		}
	]
};