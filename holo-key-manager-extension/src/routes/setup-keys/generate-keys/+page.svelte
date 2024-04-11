<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { appQueries } from '$queries';
	import { keysStore, passphraseStore, passwordStore } from '$stores';

	const { storeDeviceKey } = appQueries();

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup-pass/start');
		}
	});

	async function generate() {
		await keysStore.generate($passphraseStore, $passwordStore);

		if ($keysStore.keys) {
			passphraseStore.clean();
			passwordStore.reset();

			if ($keysStore.keys.encodedDeviceWithExtensionPassword) {
				$storeDeviceKey.mutate($keysStore.keys.encodedDeviceWithExtensionPassword, {
					onSuccess: () => {
						goto('download');
					}
				});
			}
		}
	}
</script>

{#if $keysStore.loading}
	<span>Loading</span>
{:else}
	<img src="/img/download.svg" alt="Download" class="my-4 w-12" />
	<Title>Generate Seed & Key files</Title>
	<AppParagraph
		extraProps="mx-auto max-w-md text-center"
		text="Click the button below to generate and save your seed and key files. Please save this on your external hard drive or USB drive."
	/>
	<p class="mt-4 text-center text-base font-bold text-secondary">Context:</p>
	<AppParagraph
		extraProps="mx-auto text-center"
		text="Remember, you will need BOTH the seed and your passphrase to restore any keys that are created from this seed. Remember to store your drives in save places like a safe, you can also save copies of this on digital drives"
	/>
	<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
	<Button label="Generate" onClick={generate} />
{/if}
