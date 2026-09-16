/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss'
	],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	tailwindStylesheet: './src/routes/layout.css',
	importOrder: ['<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^\\$lib', '^[./]'],
	importOrderTypeScriptVersion: '5.0.0'
};

export default config;
