import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		appDir: 'app',
		alias: {
			$components: path.resolve('./src/lib/components')
		}
	}
};

export default config;
