<script lang="ts">
	import { keysStore, passwordStore } from '$stores';

	import type { SetSecret } from '$types';
	import { goto } from '$app/navigation';
	import { EnterSecretComponent } from '$components';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($keysStore.keys.device === null) {
			goto('/setup/start');
		}
	});

	function sendPasswordSetupRequest(password: string): void {
		chrome.runtime.sendMessage(
			{
				type: 'SETUP_PASSWORD',
				password
			},
			(response) => {
				console.log('received user data', response);
			}
		);
	}

	let appPasswordState: SetSecret = 'set';
	let confirmPassword = '';

	$: charCount = $passwordStore.length;
</script>

{#if appPasswordState === 'set'}
	<EnterSecretComponent
		bind:inputValue={$passwordStore}
		showTooltip={false}
		isPassword
		isDisabled={charCount < 8}
		title="Enter password"
		description="Enter your desired password. This will be required every time you start a new browser session."
		nextLabel="Set password"
		inputState={charCount < 8
			? 'Please enter a minimum of 8 Characters'
			: `${charCount} characters`}
		next={() => (appPasswordState = 'confirm')}
	/>
{/if}
{#if appPasswordState === 'confirm'}
	<EnterSecretComponent
		bind:inputValue={confirmPassword}
		showTooltip={false}
		isPassword
		isDisabled={confirmPassword !== $passwordStore}
		title="Confirm Passphrase"
		description="Tying loose ends, please enter your passphrase again."
		nextLabel="Next"
		inputState={confirmPassword !== $passwordStore ? 'Passwords do not match' : ``}
		next={() => sendPasswordSetupRequest($passwordStore)}
	/>
{/if}
