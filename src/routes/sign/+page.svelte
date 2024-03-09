<script lang="ts">
	import { Init, Login, Title } from '$components';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupDeviceKeyQuery, applicationKeyMutation } = sessionStorageQueries();
</script>

<svelte:head>
	<title>Holo Key Manager</title>
</svelte:head>

<div class="mx-auto flex h-screen w-full max-w-[375px] flex-col items-center justify-center py-8">
	{#if $sessionQuery.isFetching || $setupDeviceKeyQuery.isFetching}
		<span>Loading</span>
	{:else if $sessionQuery.data}
		<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" class="my-4 w-12" />
		<Title>Sign page</Title>
		<h1 class="mt-4 text-2xl font-bold">Holo Key Manager</h1>
		<button
			on:click={() => $applicationKeyMutation.mutate()}
			class="mt-2 rounded bg-blue-500 px-4 py-2 text-white">Generate App Key</button
		>
	{:else if $setupDeviceKeyQuery.data}
		<Login outerWindow={true} />
	{:else}
		<Init outerWindow={true} />
	{/if}
</div>
