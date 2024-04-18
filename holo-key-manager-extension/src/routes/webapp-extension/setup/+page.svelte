<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { ActionPage } from '$components';
	import { extractDetailsFromUrl } from '$helpers';
	import { SIGN_IN } from '$shared/const';

	const submitFormData = () => {
		goto(`create-key?${new URLSearchParams(window.location.search)}`);
	};

	onMount(() => {
		if ($extractDetailsFromUrl.action === SIGN_IN) {
			goto(`select-key-to-login?${new URLSearchParams(window.location.search)}`);
		}
	});
</script>

<ActionPage
	outerWindow={true}
	mainAction={submitFormData}
	mainActionLabel="Connect"
	title="Holo Key Manager"
	subTitle="{$extractDetailsFromUrl.happName} would like to connect to Holo Key Manager"
/>
