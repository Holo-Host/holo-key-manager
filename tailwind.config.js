/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Nunito Sans', 'sans-serif']
			},
			colors: {
				primary: '#4820E3',
				gray: '#606C8B',
				'light-gray': '#262A3333'
			}
		}
	},
	plugins: []
};
