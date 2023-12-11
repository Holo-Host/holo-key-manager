<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, InputPassword, SetupContainer, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';
	import { deviceKeyContentStore } from '$stores';

	const { createPassword, passwordAndStoreDeviceKeyMutation } = sessionStorageQueries();

	let password = '';
	let confirmPassword = '';

	$: charCount = password.length;
	$: isDisabled = charCount < 8 || confirmPassword !== password;

	const { setupDeviceKeyQuery } = sessionStorageQueries();
	onMount(() => {
		if ($setupDeviceKeyQuery.data) {
			dismissWindow();
		}
	});
</script>

<SetupContainer>
	<Title>Set Key Manager Password</Title>
	<AppParagraph
		extraProps="mx-auto max-w-sm text-center"
		text="This password secures your Key Manager extension, it would be requested each time you launch it."
	/>
	<div class="w-full p-6">
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

	<div class="grid w-full grid-cols-2 gap-5 p-6">
		<Button label="Cancel" onClick={dismissWindow} color="secondary" />
		<Button
			disabled={isDisabled}
			label="Set password"
			onClick={() => {
				if ($deviceKeyContentStore) {
					return $passwordAndStoreDeviceKeyMutation.mutate(password, {
						onSuccess: () => {
							goto('/setup-keys/done');
						},
						onError: (error) => {
							console.log(error);
						}
					});
				}

				return $createPassword.mutate(password, {
					onSuccess: () => {
						goto('/setup-pass/enter-passphrase');
					}
				});
			}}
		/>
	</div>
</SetupContainer>
