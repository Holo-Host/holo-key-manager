<script lang="ts">
	import clsx from 'clsx';

	import { AppParagraph, Button, Title } from '$components';
	import { dismissWindow } from '$lib/helpers';

	import Tooltip from './Tooltip.svelte';

	export let inputValue: string;
	export let showTooltip = true;
	export let isDisabled: boolean;
	export let title: string;
	export let description: string;
	export let nextLabel: string;
	export let inputState: string;
	export let next: () => void;
</script>

<Title>{title}</Title>
<AppParagraph extraProps="mx-auto text-center" text={description} />
<div class="w-full p-6">
	<textarea
		bind:value={inputValue}
		class="h-44 w-full resize-none rounded border border-secondary px-2 py-1 text-sm"
		placeholder={title}
	/>
	<div class="flex items-center justify-between">
		<AppParagraph textColor={clsx(isDisabled && 'text-alert')} text={inputState} />
		{#if showTooltip}
			<Tooltip />
		{/if}
	</div>
</div>

<div class="grid w-full grid-cols-2 gap-5 p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button disabled={isDisabled} label={nextLabel} onClick={next} />
</div>
