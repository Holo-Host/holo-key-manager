import { derived } from 'svelte/store';

import { page } from '$app/stores';
import { relevantKeys } from '$shared/const';

export const dismissWindow = () => window.close();

export const extractDetailsFromUrl = derived(page, ($page) => {
	const unknownDetails = {
		happName: 'Unknown App',
		happId: 'Unknown ID',
		happLogo: '',
		happUiUrl: '',
		message: 'Unknown Message',
		requireEmail: false,
		requireRegistrationCode: false,
		messageId: '',
		origin: ''
	};

	const params = new URLSearchParams(new URL($page.url.href).search);

	const getParamValue = (key: (typeof relevantKeys)[number]) => {
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
		action: params.get('action') || 'Unknown Action'
	};
});
