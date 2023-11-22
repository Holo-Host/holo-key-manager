<script lang="ts">
	import { Init, Login } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupQuery } = sessionStorageQueries();
</script>

{#if $sessionQuery.isFetching || $setupQuery.isFetching}
	<span>Loading</span>
{:else if $sessionQuery.data}
	<div class="m-8">
		<div class="flex justify-between items-center mb-4">
			<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
			<button on:click={dismissWindow} class="bg-transparent border-none">
				<img src="/img/close.svg" alt="Close" />
			</button>
		</div>
		<h1 class="font-bold text-2xl mt-4">Holo Key Manager</h1>
	</div>
{:else if $setupQuery.data}
	<Login />
{:else}
	<Init />
{/if}
