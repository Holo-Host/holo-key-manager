<script lang="ts">
	import { keysStore } from '$stores';
	import { goto } from '$app/navigation';
	import { EnterSecretComponent } from '$components';
	import { onMount } from 'svelte';
	import type { SetSecret } from '$types';
	import { sessionStorageQueries } from '$queries';

	const { passwordWithDeviceKeyMutation } = sessionStorageQueries();

	onMount(() => {
		if ($keysStore.keys.device === null) {
			goto('/setup/start');
		}
	});

	const setPassword = async (password: string): Promise<void> => {
		if ($keysStore.keys.device !== null) {
			$passwordWithDeviceKeyMutation.mutate(
				{
					password,
					secretData: $keysStore.keys.device
				},
				{
					onSuccess: () => {
						keysStore.resetAll();
						goto('/done');
					}
				}
			);
		}
	};

	let appPasswordState: SetSecret = 'set';
	let confirmPassword = '';
	let password = '';

	$: charCount = password.length;
</script>

{#if appPasswordState === 'set'}
	<EnterSecretComponent
		bind:inputValue={password}
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
		isDisabled={confirmPassword !== password}
		title="Confirm Passphrase"
		description="Tying loose ends, please enter your passphrase again."
		nextLabel="Next"
		inputState={confirmPassword !== password ? 'Passwords do not match' : ``}
		next={() => setPassword(password)}
	/>
{/if}
