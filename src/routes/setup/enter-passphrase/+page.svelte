<script lang="ts">
	import PopupDialog from './PopupDialog.svelte';
	import { getContext } from 'svelte';
	import { passphrase } from '$stores';
	import EnterPassphraseComponent from './EnterPassphraseComponent.svelte';
	import type { SetPassphrase } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	const passphraseStore = getContext<Writable<string>>(passphrase);

	let passphraseState: SetPassphrase = 'set';
	let confirmPassphrase = '';
	let showDialog = false;

	$: charCount = $passphraseStore.length;
</script>

{#if passphraseState === 'set'}
	<EnterPassphraseComponent
		bind:inputValue={$passphraseStore}
		isRed={charCount < 20}
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
	<EnterPassphraseComponent
		bind:inputValue={confirmPassphrase}
		isRed={confirmPassphrase !== $passphraseStore}
		title="Confirm Passphrase"
		description="Tying loose ends, please enter your passphrase again."
		nextLabel="Next"
		inputState={confirmPassphrase !== $passphraseStore ? 'Passphrases do not match' : ``}
		next={() => goto('/setup/generate-keys')}
	/>
{/if}
