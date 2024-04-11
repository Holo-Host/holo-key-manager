import { derived } from 'svelte/store';

import { browser } from '$app/environment';
import { page } from '$app/stores';
import { relevantKeys } from '$shared/const';

export const dismissWindow = () => window.close();

export const extractDetailsFromUrl = derived(page, ($page) => {
	const unknownDetails = {
		action: 'Unknown Action',
		happName: 'Unknown App',
		happId: 'Unknown ID',
		requireEmail: false,
		requireRegistrationCode: false
	};

	if (!browser) {
		return unknownDetails;
	}

	const params = new URLSearchParams(new URL($page.url.href).search);

	const getParamValue = (key: keyof typeof unknownDetails) => {
		const param = params.get(key);
		return param === 'true' ? true : param === 'false' ? false : param || unknownDetails[key];
	};

	const details = relevantKeys.reduce(
		(acc, key) => ({
			...acc,
			[key]: getParamValue(key)
		}),
		{}
	);

	return {
		...unknownDetails,
		...details,
		action: getParamValue('action')
	};
});
