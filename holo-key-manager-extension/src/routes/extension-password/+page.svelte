<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppContainer, AppParagraph, Button, Input, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';
	import { deviceKeyContentStore, passwordStore } from '$stores';

	const { createPassword, passwordAndStoreDeviceKeyMutation } = appQueries();

	let confirmPassword = '';

	$: charCount = $passwordStore.length;
	$: isDisabled = charCount < 8 || confirmPassword !== $passwordStore;

	const { setupDeviceKeyQuery } = appQueries();
	onMount(() => {
		passwordStore.reset();
		if ($setupDeviceKeyQuery.data) {
			dismissWindow();
		}
	});
</script>

<AppContainer>
	<Title>Set Key Manager Password</Title>
	<AppParagraph
		extraProps="mx-auto max-w-sm text-center"
		text="This password secures your Key Manager extension and is requested each time you launch it."
	/>
	<div class="w-full p-6">
		<Input
			type="password"
			bind:value={$passwordStore}
			label="Enter Password (8 Characters min)"
			extraProps="mb-6"
			error={charCount < 8 ? 'Please enter a minimum of 8 characters' : ''}
		/>
		<Input
			type="password"
			bind:value={confirmPassword}
			label="Confirm Password"
			extraProps="mb-4"
			error={confirmPassword !== $passwordStore ? "Password doesn't match" : ''}
		/>
	</div>

	<div class="grid w-full grid-cols-2 gap-5 p-6">
		<Button label="Cancel" onClick={dismissWindow} color="secondary" />
		<Button
			disabled={isDisabled}
			label="Set password"
			onClick={() => {
				if ($deviceKeyContentStore) {
					return $passwordAndStoreDeviceKeyMutation.mutate($passwordStore, {
						onSuccess: () => {
							goto('/setup-keys/done');
						}
					});
				}

				return $createPassword.mutate($passwordStore, {
					onSuccess: () => {
						goto('/setup-pass/enter-passphrase');
					}
				});
			}}
		/>
	</div>
</AppContainer>
