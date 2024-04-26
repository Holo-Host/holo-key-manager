<script lang="ts">
	import { AppParagraph, Button } from '$components';
	import { dismissWindow } from '$lib/helpers';

	import LogoCloseBar from './LogoCloseBar.svelte';
	import Title from './Title.svelte';

	export let outerWindow = false;
	export let mainAction: () => void;
	export let secondaryAction = dismissWindow;
	export let mainActionLabel: string;
	export let secondaryActionLabel = 'Cancel';
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
			class="mb-4 max-w-[48px]"
		/>
		<Title small>{title}</Title>
		<AppParagraph extraProps="my-4 max-w-xs text-center" text={subTitle} />
	</div>

	<Button label={mainActionLabel} onClick={mainAction} extraBottomMargin />
	<Button label={secondaryActionLabel} onClick={secondaryAction} color="secondary" />
</div>
