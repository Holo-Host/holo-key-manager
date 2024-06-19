<script lang="ts">
	import clsx from 'clsx';
	import { derived } from 'svelte/store';

	import { AppParagraph, Button, LogoCloseBar } from '$components';
	import { dismissWindow, extractDetailsFromUrl } from '$helpers';
	import { appQueries } from '$queries';

	const { applicationsListQuery, signInWithKeyMutation } = appQueries();

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

	let selectedKey = '';

	const selectKey = (key: string) => {
		selectedKey = key;
	};
</script>

<div class="mt-4 flex h-screen flex-col">
	<LogoCloseBar />
	<div class="flex flex-col">
		<h1 class="mx-auto mt-4 text-center text-2xl font-bold">Select a preferred key</h1>
		<AppParagraph
			extraProps="mx-auto  my-2 max-w-xs text-center"
			text="Select your preferred key to connect with."
		/>
		<p class="my-2 text-base">Keys</p>
		{#if $applicationKeysQuery.length > 0}
			<div class="max-h-44 overflow-auto">
				{#each $applicationKeysQuery as key, index}
					{@const selected = selectedKey === key.keyName}
					<button
						class={clsx('flex w-full items-center justify-between border p-2', {
							'bg-row-background': index % 2 === 1,
							'border-primary': selected,
							'border-transparent': !selected
						})}
						on:click={() => selectKey(key.keyName)}
					>
						<p class="font-light">{key.keyName}</p>
						<img
							src={`/img/${selected ? 'selected' : 'select'}-arrow.svg`}
							alt="Arrow"
							class="text-primary"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div class="mt-auto">
		<Button
			disabled={selectedKey === ''}
			label="Login with selected key"
			onClick={() =>
				$signInWithKeyMutation.mutate(
					{
						happId: $extractDetailsFromUrl.happId,
						keyName: selectedKey,
						origin: $extractDetailsFromUrl.origin,
						messageId: $extractDetailsFromUrl.messageId,
						currentAppsList: $applicationsListQuery.data || []
					},
					{
						onSuccess: dismissWindow
					}
				)}
			extraBottomMargin
		/>
	</div>
</div>
