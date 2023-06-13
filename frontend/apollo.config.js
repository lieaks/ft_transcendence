module.exports = {
	client: {
		service: {
			name: 'ft_transcendence',
			url: import.meta.env.VITE_BACKEND_URL + '/graphql'
		},
		includes: [
			'src/**/*.vue',
			'src/**/*.js',
		],
	},
}
