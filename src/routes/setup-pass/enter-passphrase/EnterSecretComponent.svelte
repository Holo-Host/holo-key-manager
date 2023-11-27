<script lang="ts">
	import AppParagraph from '$components/AppParagraph.svelte';
	import Button from '$components/Button.svelte';
	import Tooltip from '../../../lib/components/Tooltip.svelte';
	import Title from '$components/Title.svelte';
	import { dismissWindow } from '$lib/helpers';
	import clsx from 'clsx';

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
<div class="p-6 w-full">
	<textarea
		bind:value={inputValue}
		class="w-full h-44 rounded border border-secondary resize-none py-1 px-2 text-sm"
		placeholder={title}
	/>
	<div class="flex justify-between items-center">
		<AppParagraph textColor={clsx(isDisabled && 'text-alert')} text={inputState} />
		{#if showTooltip}
			<Tooltip />
		{/if}
	</div>
</div>

<div class="grid grid-cols-2 gap-5 w-full p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button disabled={isDisabled} label={nextLabel} onClick={next} />
</div>
