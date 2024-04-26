<script lang="ts">
	import { goto } from '$app/navigation';
	import { appQueries } from '$queries';

	const { allApplicationsQuery } = appQueries();

	let searchInput = '';

	$: filteredApplications = $allApplicationsQuery.data?.filter(
		(applicationKey) =>
			applicationKey.happId.toLowerCase().includes(searchInput.toLowerCase()) ||
			applicationKey.happName.toLowerCase().includes(searchInput.toLowerCase())
	);
</script>

<div class="mt-4 flex justify-between">
	<h2 class="text-xl font-semibold">Managed hApps</h2>
	<div class="relative">
		<img
			src={'/img/magnifying-glass.svg'}
			alt={'Search'}
			class="absolute left-3 top-1/2 -translate-y-1/2"
		/>
		<input
			placeholder="Search hApp"
			bind:value={searchInput}
			class="rounded-md border border-grey py-1.5 pl-9 outline-none focus:outline-none"
		/>
	</div>
</div>
{#each filteredApplications || [] as applicationKey}
	<div class="flex items-center justify-between border-b border-grey py-2 last:border-b-0">
		<div class="flex items-center">
			{#if !!applicationKey.happLogo}
				<img src={applicationKey.happLogo} alt="hApp Logo" class="mr-2 h-10 w-10" />
			{/if}
			<span>{applicationKey.happName}</span>
		</div>
		<div class="flex">
			{#if !!applicationKey.happUiUrl}
				<a
					href={applicationKey.happUiUrl}
					class="mr-2 flex items-center justify-center text-sm text-secondary"
					target="_blank"
				>
					Visit
					<img src="/img/arrow-outward.svg" alt="Visit page" class="ml-2" />
				</a>
			{/if}
			<button
				class="rounded-md px-4 py-2 text-sm text-primary"
				on:click={() => goto(`keys?happId=${applicationKey.happId}`)}
			>
				View Keys
			</button>
		</div>
	</div>
{/each}
