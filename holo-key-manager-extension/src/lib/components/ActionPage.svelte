<script lang="ts">
	import { AppParagraph, Button } from '$components';
	import { dismissWindow } from '$lib/helpers';

	import LogoCloseBar from './LogoCloseBar.svelte';

	export let outerWindow = false;
	export let mainAction: () => void;
	export let mainActionLabel: string;
	export let title: string;
	export let subTitle: string;
</script>

<div class="m-8">
	{#if !outerWindow}
		<LogoCloseBar />
	{/if}

	<div class="flex flex-col items-center justify-center">
		<img
			src={mainActionLabel === 'Setup' ? '/img/setup.svg' : '/img/holo_logo.svg'}
			alt={mainActionLabel}
			class="max-w-[48px]"
		/>
		<h1 class="mt-4 text-2xl font-bold">{title}</h1>
		<AppParagraph extraProps="my-4 max-w-xs text-center" text={subTitle} />
	</div>

	<Button label={mainActionLabel} onClick={mainAction} extraBottomMargin />
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
</div>
