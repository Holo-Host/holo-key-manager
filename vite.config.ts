import { sveltekit } from '@sveltejs/kit/vite';
// import typescript from 'rollup-plugin-typescript2';
// import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
		// typescript({
		// 	include: ['scripts/**/*.ts']
		// 	// TypeScript plugin options
		// }),
		// copy({
		// 	targets: [{ src: 'scripts/**/*.js', dest: 'build/scripts' }],
		// 	hook: 'writeBundle' // Use the appropriate hook for copying
		// })
	]
});
