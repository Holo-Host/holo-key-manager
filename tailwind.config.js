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
				'primary-disabled': '#C8C1E3',
				secondary: '#606C8B',
				tertiary: '#5C4DA6',
				quaternary: '#313C59',
				'light-gray': '#262A3333',
				'primary-border': '#C8BBFA',
				'primary-background': '#FBFAFF',
				alert: '#D92D20',
				'alert-background': '#FDA29B'
			}
		}
	},
	plugins: []
};
