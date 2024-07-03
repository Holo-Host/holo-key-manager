/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Nunito Sans', 'sans-serif']
			},
			colors: {
				primary: '#00838D',
				'primary-disabled': '#B2DADD',
				secondary: '#606C8B',
				grey: '#D2D0DD',
				'light-gray': '#262A3333',
				'primary-background': '#FBFAFF',
				'row-background': '#F9F9FB',
				alert: '#D92D20',
				'alert-background': '#FFFBFA'
			}
		}
	},
	plugins: []
};
