import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		appDir: 'app',
		alias: {
			$components: path.resolve('./src/lib/components'),
			$const: path.resolve('./src/lib/const'),
			$commonConst: path.resolve('./common/const'),
			$helpers: path.resolve('./src/lib/helpers'),
			$commonHelpers: path.resolve('./common/helpers'),
			$stores: path.resolve('./src/lib/stores'),
			$types: path.resolve('./src/lib/types'),
			$commonTypes: path.resolve('./common/types'),
			$queries: path.resolve('./src/lib/queries'),
			$services: path.resolve('./src/lib/services'),
			$commonServices: path.resolve('./common/services')
		}
	}
};

export default config;
