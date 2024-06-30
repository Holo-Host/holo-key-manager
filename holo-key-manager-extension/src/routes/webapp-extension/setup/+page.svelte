<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { ActionPage, Loading } from '$components';
	import { dismissWindow, extractDetailsFromUrl, sendMessageAndHandleResponse } from '$helpers';
	import { appQueries } from '$queries';
	import { NO_KEY_FOR_HAPP, SENDER_EXTENSION, SIGN_IN } from '$shared/const';

	const { applicationsListQuery } = appQueries();

	const submitFormData = () => {
		goto(`create-key?${new URLSearchParams(window.location.search)}`);
	};

	onMount(() => {
		if ($extractDetailsFromUrl.action === SIGN_IN) {
			const unsubscribe = applicationsListQuery.subscribe(async (data) => {
				if (data.data === undefined) return;

				if (data.data.some((app) => app.happId === $extractDetailsFromUrl.happId)) {
					return goto(`select-key-to-login?${new URLSearchParams(window.location.search)}`);
				}

				await sendMessageAndHandleResponse(
					{
						sender: SENDER_EXTENSION,
						action: NO_KEY_FOR_HAPP
					},
					$extractDetailsFromUrl.messageId
				);
				return dismissWindow();
			});
			return () => unsubscribe?.();
		}
	});
</script>

{#if $applicationsListQuery.isFetching}
	<Loading />
{:else}
	<ActionPage
		outerWindow={true}
		mainAction={submitFormData}
		mainActionLabel="Connect"
		title="Holo Key Manager"
		subTitle="{$extractDetailsFromUrl.happName} would like to connect to Holo Key Manager"
	/>
{/if}
