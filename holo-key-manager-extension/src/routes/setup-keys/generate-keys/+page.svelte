<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Loading, Title } from '$components';
	import { appQueries } from '$queries';
	import { keysStore, passphraseStore, passwordStore } from '$stores';

	const { storeDeviceKey, generateKeysMutation } = appQueries();

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup-pass/start');
		}
	});

	async function generate() {
		try {
			await $generateKeysMutation.mutateAsync({
				passphrase: $passphraseStore,
				password: $passwordStore
			});

			passphraseStore.clean();
			passwordStore.reset();

			const encodedDeviceKey = $keysStore?.encodedDeviceWithExtensionPassword;
			if (encodedDeviceKey) {
				await $storeDeviceKey.mutateAsync(encodedDeviceKey);
				goto('download');
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

{#if $generateKeysMutation.isPending || $storeDeviceKey.isPending}
	<div class="flex flex-col items-center justify-center">
		<Loading />
		<p class="text-base font-light">Generating keys...</p>
	</div>
{:else}
	<img src="/img/download.svg" alt="Download" class="my-4 w-12" />
	<Title>Generate seed and key files</Title>
	<AppParagraph
		extraProps="mx-auto max-w-md text-center"
		text="Click the button below to generate and save your seed and key files. Please save this on your external hard drive or USB drive."
	/>
	<p class="mt-4 text-center text-base font-bold text-secondary">Context:</p>
	<AppParagraph
		extraProps="mx-auto text-center"
		text="Remember, you will need BOTH the seed and your passphrase to restore any keys that are created from this seed."
	/>
	<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
	<Button label="Generate" onClick={generate} />
{/if}
