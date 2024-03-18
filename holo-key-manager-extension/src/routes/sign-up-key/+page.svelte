<script lang="ts">
	import { ActionPage, Login } from '$components';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupDeviceKeyQuery } = sessionStorageQueries();
	$: isLoading = $sessionQuery.isFetching || $setupDeviceKeyQuery.isFetching;
	$: hasSessionData = $sessionQuery.data;
	$: hasSetupData = $setupDeviceKeyQuery.data;
</script>

<svelte:head>
	<title>Holo Key Manager</title>
</svelte:head>

<div class="mx-auto flex h-screen w-full max-w-[375px] flex-col items-center justify-center py-8">
	{#if isLoading}
		<span>Loading</span>
	{:else if hasSessionData}
		<ActionPage
			outerWindow={true}
			mainAction={() => {}}
			mainActionLabel="Connect"
			title="Holo Key Manager"
			subTitle="Haxe would like to connect to Holo Key Manager"
		/>
	{:else if hasSetupData}
		<Login outerWindow={true} />
	{:else}
		<ActionPage
			outerWindow={true}
			mainAction={() => window.open('setup-pass/start.html', '_blank')}
			mainActionLabel="Setup"
			title="Setup Required"
			subTitle="You are yet to setup Holo Key Manager. Click “start setup” to begin."
		/>
	{/if}
</div>
