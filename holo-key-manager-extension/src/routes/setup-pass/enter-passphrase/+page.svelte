<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SetSecret } from '$lib/types';
	import { appQueries } from '$queries';
	import { passphraseStore } from '$stores';

	import EnterSecretComponent from './EnterSecretComponent.svelte';
	import PopupDialog from './PopupDialog.svelte';

	let passphraseState: SetSecret = 'set';
	let confirmPassphrase = '';
	let showDialog = false;

	$: charCount = $passphraseStore.length;

	const { setupPasswordQuery } = appQueries();

	$: {
		if ($setupPasswordQuery.data === false) {
			goto('start');
		}
	}
</script>

{#if passphraseState === 'set'}
	<EnterSecretComponent
		isDisabled={charCount < 20}
		bind:inputValue={$passphraseStore}
		title="Enter Passphrase"
		description="Make your passphrase as strong as possible. It should be long, include a mix of many different type of characters, and be hard to guess. Save it somewhere safe"
		nextLabel="Set Passphrase"
		inputState={charCount < 20
			? 'Please enter a minimum of 20 characters'
			: `${charCount} characters`}
		next={() => (showDialog = true)}
	/>
	{#if showDialog}
		<PopupDialog next={() => (passphraseState = 'confirm')} dismiss={() => (showDialog = false)} />
	{/if}
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
