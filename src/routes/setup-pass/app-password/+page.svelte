<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { passwordStore } from '$stores';
	import { sessionStorageQueries } from '$queries';
	import { dismissWindow } from '$helpers';
	import InputPassword from '$components/InputPassword.svelte';

	const { createPassword } = sessionStorageQueries();

	let confirmPassword = '';

	$: charCount = $passwordStore.length;
	$: isDisabled = charCount < 8 || confirmPassword !== $passwordStore;
</script>

<Title>Set Key Manager Password</Title>
<AppParagraph
	extraProps="mx-auto max-w-sm text-center"
	text="This password secures your Key Manager extension, it would be requested each time you launch it."
/>
<div class="w-full p-6">
	<InputPassword
		bind:value={$passwordStore}
		label="New Password (8 Characters min)"
		extraProps="mb-6"
		error={charCount < 8 ? 'Please enter a minimum of 8 Characters' : ''}
	/>
	<InputPassword
		bind:value={confirmPassword}
		label="Confirm New Password"
		extraProps="mb-4"
		error={confirmPassword !== $passwordStore ? "Password doesn't Match" : ''}
	/>
</div>

<div class="grid w-full grid-cols-2 gap-5 p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button
		disabled={isDisabled}
		label="Set password"
		onClick={() =>
			$createPassword.mutate($passwordStore, {
				onSuccess: () => {
					goto('enter-passphrase');
				}
			})}
	/>
</div>
