<script lang="ts">
	import { onMount } from 'svelte';
	import { keysStore, passphraseStore } from '$stores';
	import { goto } from '$app/navigation';
	import { Button, Title, AppParagraph } from '$components';

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup/start');
		}
	});

	async function generate() {
		await keysStore.generate($passphraseStore);
		if ($keysStore.keys) {
			$passphraseStore = '';
			goto('/setup/download');
		}
	}
</script>

{#if $keysStore.loading}
	<span>Loading</span>
{:else}
	<img src="/img/download.svg" alt="Download" class="w-12 my-4" />
	<Title>Generate Seed & Key files</Title>
	<AppParagraph
		extraProps="mx-auto text-center max-w-md"
		text="Click the button below to generate and save your seed and key files. Please save this on your external hard drive or USB drive."
	/>
	<p class="text-secondary text-base font-bold text-center mt-4">Context:</p>
	<AppParagraph
		extraProps="mx-auto text-center"
		text="Remember, you will need BOTH the seed and your passphrase to restore any keys that are created from this seed. Remember to store your drives in save places like a safe, you can also save copies of this on digital drives"
	/>
	<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
	<Button label="Generate" onClick={generate} />
{/if}
