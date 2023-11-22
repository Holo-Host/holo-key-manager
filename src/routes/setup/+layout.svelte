<script lang="ts">
	import { page } from '$app/stores';
	import { SetupContainer } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const goBack = () => window.history.back();

	const restrictedPaths = ['start', 'download', 'done'];
	$: allowGoBack = !restrictedPaths.some((path) => $page.url.pathname.includes(path));

	const { setupQuery } = sessionStorageQueries();

	$: if ($setupQuery.data && !$page.url.pathname.includes('app-password')) {
		dismissWindow();
	}
</script>

<SetupContainer>
	{#if allowGoBack}
		<button class="self-start ml-6 mb-4 flex items-center" on:click={goBack}>
			<img src="/img/arrow-left.svg" alt="Arrow" />
			<span class="ml-2 text-base">Back</span></button
		>
	{/if}
	<slot />
</SetupContainer>
