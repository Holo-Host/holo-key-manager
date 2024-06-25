<script lang="ts">
	import { ActionPage, Login } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';

	const { isSignedInToExtensionQuery, setupDeviceKeyQuery } = appQueries();
	$: isLoading = $isSignedInToExtensionQuery.isFetching || $setupDeviceKeyQuery.isFetching;
	$: hasSessionData = $isSignedInToExtensionQuery.data;
	$: hasSetupData = $setupDeviceKeyQuery.data;
</script>

<svelte:head>
	<title>Holo Key Manager</title>
</svelte:head>

<div class="mx-auto flex h-screen w-full max-w-xs flex-col justify-center py-8">
	{#if isLoading}
		<span>Loading</span>
	{:else if hasSessionData}
		<slot />
	{:else if hasSetupData}
		<Login outerWindow={true} />
	{:else}
		<ActionPage
			outerWindow={true}
			mainAction={() => {
				window.open('/setup-pass/start.html', '_blank');
				dismissWindow();
			}}
			mainActionLabel="Setup"
			title="Setup Required"
			subTitle="Please set up Holo Key Manager to continue."
		/>
	{/if}
</div>
