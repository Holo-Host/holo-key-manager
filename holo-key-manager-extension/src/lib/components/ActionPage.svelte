<script lang="ts">
	import { AppParagraph, Button } from '$components';
	import { dismissWindow } from '$lib/helpers';

	export let outerWindow = false;
	export let mainAction: () => void;
	export let mainActionLabel: string;
	export let title: string;
	export let subTitle: string;
</script>

<div class="m-8">
	{#if !outerWindow}
		<div class="mb-4 flex items-center justify-between">
			<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
			<button on:click={dismissWindow} class="border-none bg-transparent">
				<img src="/img/close.svg" alt="Close" />
			</button>
		</div>
	{/if}

	<div class="flex flex-col items-center justify-center">
		<img src="/img/setup.svg" alt="Setup" class="max-w-[48px]" />
		<h1 class="mt-4 text-2xl font-bold">{title}</h1>
		<AppParagraph extraProps="my-4 max-w-xs text-center" text={subTitle} />
	</div>

	<Button label={mainActionLabel} onClick={mainAction} extraBottomMargin />
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
</div>
