<script lang="ts">
	import { page } from '$app/stores';
	import { AppContainer } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const goBack = () => window?.history.back();

	const { setupDeviceKeyQuery } = sessionStorageQueries();
	$: if ($setupDeviceKeyQuery.data) {
		dismissWindow();
	}
</script>

<AppContainer>
	{#if !$page.url.pathname.includes('start')}
		<button class="mb-4 ml-6 flex items-center self-start" on:click={goBack}>
			<img src="/img/arrow-left.svg" alt="Arrow" />
			<span class="ml-2 text-base">Back</span></button
		>
	{/if}
	<slot />
</AppContainer>
