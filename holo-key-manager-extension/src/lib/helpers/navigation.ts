import { derived } from 'svelte/store';

import { browser } from '$app/environment';
import { page } from '$app/stores';

export const dismissWindow = () => window.close();

export const extractHAppDetailsFromUrl = derived(page, ($page) => {
	if (!browser) return { happName: 'Unknown App', happId: 'Unknown ID' };
	const url = new URL($page.url.href);
	const params = new URLSearchParams(url.search);
	return {
		happName: params.get('happName') || 'Unknown App',
		happId: params.get('happId') || 'Unknown ID',
		requireEmail: params.get('requireEmail') === 'true',
		requireRegistrationCode: params.get('requireRegistrationCode') === 'true'
	};
});
