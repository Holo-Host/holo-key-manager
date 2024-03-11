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
			$sharedConst: path.resolve('../shared/const'),
			$helpers: path.resolve('./src/lib/helpers'),
			$sharedHelpers: path.resolve('../shared/helpers'),
			$stores: path.resolve('./src/lib/stores'),
			$types: path.resolve('./src/lib/types'),
			$sharedTypes: path.resolve('../shared/types'),
			$queries: path.resolve('./src/lib/queries'),
			$services: path.resolve('./src/lib/services'),
			$sharedServices: path.resolve('../shared/services')
		}
	}
};

export default config;
