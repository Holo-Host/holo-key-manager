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
			'@shared': path.resolve('../shared/'),
			'@shared/*': path.resolve('../shared/*')
		}
	}
});
