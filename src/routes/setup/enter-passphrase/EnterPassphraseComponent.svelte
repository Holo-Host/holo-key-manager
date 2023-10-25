<script lang="ts">
	import AppParagraph from '$components/AppParagraph.svelte';
	import Button from '$components/Button.svelte';
	import Tooltip from '$components/Tooltip.svelte';
	import { dismissExtensionWindow } from '$lib/helpers';
	import clsx from 'clsx';

	export let inputValue: string;
	export let isRed: boolean;
	export let title: string;
	export let description: string;
	export let nextLabel: string;
	export let inputState: string;
	export let next: () => void;
</script>

<h1 class="text-4xl font-bold text-center mb-2">{title}</h1>
<AppParagraph extraProps="mx-auto text-center" text={description} />
<div class="p-6 w-full">
	<textarea
		bind:value={inputValue}
		class="w-full h-44 rounded border border-secondary resize-none py-1 px-2 text-sm"
		placeholder={title}
	/>
	<div class="flex justify-between items-center">
		<AppParagraph textColor={clsx(isRed && 'text-alert')} text={inputState} />
		<Tooltip>
			<div slot="content">
				<div class="flex items-center text-primary text-base">
					<p>What is passphrase</p>
					<img src="/img/question.svg" alt="Question icon" class="ml-2" />
				</div>
			</div>
			<div slot="body">
				<strong class="text-sm text-black">Passphrase</strong>
				<p>
					This is can be a word or sentence of your choice. E.g Manager (word) or The quick brown
					fox jumps over the lazy dog (sentence). Make your passphrase as strong as possible. It
					should be long, include a mix of many different types of characters, and be hard to guess.
				</p>
				<p class="pt-2">
					You can optionally turn off your internet while doing this for added security.
				</p>
				<div class="pt-2">
					<strong>Tip:</strong> Write down or store your passphrase in a password manager.
				</div>
			</div>
		</Tooltip>
	</div>
</div>

<div class="grid grid-cols-2 gap-5 w-full p-6">
	<Button label="Cancel" onClick={dismissExtensionWindow} color="secondary" />
	<Button disabled={inputValue.length < 20} label={nextLabel} onClick={next} />
</div>
