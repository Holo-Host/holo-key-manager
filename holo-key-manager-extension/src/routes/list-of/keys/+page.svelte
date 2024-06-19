<script lang="ts">
	import { derived } from 'svelte/store';

	import { GoBack } from '$components';
	import { extractDetailsFromUrl } from '$helpers';
	import { appQueries } from '$queries';

	const { applicationsListQuery } = appQueries();

	const applicationKeysQuery = derived(
		[applicationsListQuery, extractDetailsFromUrl],
		([$applicationsListQuery, $extractDetailsFromUrl]) => {
			return (
				$applicationsListQuery?.data?.filter(
					(app) => app.happId === $extractDetailsFromUrl.happId
				) || []
			);
		}
	);
</script>

<GoBack extraClass="mt-8" />
{#if $applicationKeysQuery.length > 0}
	{@const applicationKeyFirst = $applicationKeysQuery[0]}
	<div class="mt-4 flex items-center justify-between">
		<div class="flex items-center">
			{#if applicationKeyFirst.happLogo}
				<img src={applicationKeyFirst.happLogo} alt="hApp Logo" class="mr-2 h-10 w-10" />
			{/if}
			<h2 class="text-center text-xl font-semibold">{applicationKeyFirst.happName}</h2>
		</div>
		<div class="flex">
			{#if applicationKeyFirst.happUiUrl}
				<a
					href={applicationKeyFirst.happUiUrl}
					class="mr-2 flex items-center justify-center text-sm text-primary"
					target="_blank"
				>
					Visit
					<img src="/img/arrow-outward-primary.svg" alt="Visit page" class="ml-2" />
				</a>
			{/if}
		</div>
	</div>
	<h2 class="border-b border-grey py-4 text-xl font-semibold">Keys</h2>
	<table class="mt-4 w-full rounded-lg border">
		{#each $applicationKeysQuery as applicationKey, index}
			<tr class="w-full" class:bg-gray-100={index % 2 === 0}>
				<td class="border-b px-4 py-2 last:border-b-0">{applicationKey.keyName}</td>
				<td class="flex justify-end border-b px-4 py-2 last:border-b-0">
					<button class="mr-2 rounded-md px-4 py-2 text-sm text-grey" disabled> Delete Key </button>
					<button class="rounded-md px-4 py-2 text-sm text-grey" disabled> Change Key </button>
				</td>
			</tr>
		{/each}
	</table>
{/if}
