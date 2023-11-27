<script lang="ts">
	import PopupDialog from './PopupDialog.svelte';
	import { passphraseStore } from '$stores';
	import type { SetSecret } from '$lib/types';
	import { goto } from '$app/navigation';
	import EnterSecretComponent from './EnterSecretComponent.svelte';
	import { sessionStorageQueries } from '$queries';

	let passphraseState: SetSecret = 'set';
	let confirmPassphrase = '';
	let showDialog = false;

	$: charCount = $passphraseStore.length;

	const { setupPasswordQuery } = sessionStorageQueries();

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
		description="Enter your desired passphrase and remind to keep it safe."
		nextLabel="Set Passphrase"
		inputState={charCount < 20
			? 'Please enter a minimum of 20 Characters'
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
		description="Tying loose ends, please enter your passphrase again."
		nextLabel="Next"
		inputState={confirmPassphrase !== $passphraseStore ? 'Passphrases do not match' : ``}
		next={() => goto('/setup-keys/generate-keys')}
	/>
{/if}
