<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import type { SetSecret } from '$lib/types';
	import { appQueries } from '$queries';
	import { passphraseStore } from '$stores';

	import EnterSecretComponent from './EnterSecretComponent.svelte';

	let passphraseState: SetSecret = 'set';
	let confirmPassphrase = '';

	$: charCount = $passphraseStore.length;

	const { setupPasswordQuery } = appQueries();

	onMount(() =>
		setupPasswordQuery.subscribe(({ data }) => {
			if (data === false) {
				goto('start');
			}
		})
	);
</script>

{#if passphraseState === 'set'}
	<EnterSecretComponent
		isDisabled={charCount < 20}
		bind:inputValue={$passphraseStore}
		title="Enter Passphrase"
		description="Your passphrase will be used to encrypt your master seed and key files. Make it as strong as possible. It should be long, include a mix of many different type of characters, and be hard to guess. Save it somewhere safe"
		nextLabel="Set passphrase"
		inputState={charCount < 20
			? 'Please enter a minimum of 20 characters'
			: `${charCount} characters`}
		next={() => (passphraseState = 'confirm')}
	/>
{/if}

{#if passphraseState === 'confirm'}
	<EnterSecretComponent
		bind:inputValue={confirmPassphrase}
		isDisabled={confirmPassphrase !== $passphraseStore}
		title="Confirm Passphrase"
		description="Please enter your passphrase again."
		nextLabel="Next"
		inputState={confirmPassphrase !== $passphraseStore ? 'Passphrases do not match' : ``}
		next={() => goto('/setup-keys/generate-keys')}
	/>
{/if}
