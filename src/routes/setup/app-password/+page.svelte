<script lang="ts">
	import { keysStore } from '$stores';
	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { onMount } from 'svelte';
	import { sessionStorageQueries } from '$queries';
	import { dismissWindow } from '$helpers';
	import InputPassword from '$components/InputPassword.svelte';

	const { passwordWithDeviceKeyMutation } = sessionStorageQueries();

	onMount(() => {
		if ($keysStore.keys.device === null) {
			goto('/setup/start');
		}
	});

	const setPassword = async (): Promise<void> => {
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

	let confirmPassword = '';
	let password = '';

	$: charCount = password.length;
	$: isDisabled = charCount < 8 && confirmPassword !== password;
</script>

<Title>Set Key Manager Password</Title>
<AppParagraph
	extraProps="mx-auto text-center max-w-sm"
	text="This password secures your Key Manager extension, it would be requested each time you launch it."
/>
<div class="p-6 w-full">
	<InputPassword
		bind:value={password}
		label="New Password (8 Characters min)"
		extraProps="mb-6"
		error={charCount < 8 ? 'Please enter a minimum of 8 Characters' : ''}
	/>
	<InputPassword
		bind:value={confirmPassword}
		label="Confirm New Password"
		extraProps="mb-4"
		error={confirmPassword !== password ? "Password doesn't Match" : ''}
	/>
</div>

<div class="grid grid-cols-2 gap-5 w-full p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button disabled={isDisabled} label="Set password" onClick={setPassword} />
</div>
