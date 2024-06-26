import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/**/*.test.ts']
	},
	resolve: {
		alias: {
			$components: path.resolve('./src/lib/components'),
			$const: path.resolve('./src/lib/const'),
			$shared: path.resolve('../shared'),
			$helpers: path.resolve('./src/lib/helpers'),
			$stores: path.resolve('./src/lib/stores'),
			$types: path.resolve('./src/lib/types'),
			$queries: path.resolve('./src/lib/queries'),
			$services: path.resolve('./src/lib/services')
		}
	}
});
