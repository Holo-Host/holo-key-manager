import path from 'path';
import { defineConfig } from 'vitest/config';
export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/**/*.test.ts'],
		poolOptions: {
			threads: {
				singleThread: true
			}
		}
	},
	resolve: {
		alias: {
			$types: path.resolve('./holo-key-manager-extension/src/lib/types')
		}
	}
});
