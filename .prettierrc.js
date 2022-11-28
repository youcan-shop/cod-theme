module.exports = {
	...require('@shopify/prettier-plugin-liquid'),
	overrides: [
		{
			files: './**/*.liquid',
			options: {
				parser: 'liquid',
			},
		},
	],
}
