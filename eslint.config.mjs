import sanityStudioModule from '@sanity/eslint-config-studio'

const sanityStudio = sanityStudioModule.default ?? sanityStudioModule

export default [
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'.cursor/skills/**',
			'.github/skills/**',
			'next-env.d.ts',
		],
	},
	{
		files: ['scripts/**/*.mjs'],
		languageOptions: {
			globals: {
				console: 'readonly',
				fetch: 'readonly',
				process: 'readonly',
			},
		},
	},
	...sanityStudio,
]
