<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppContainer, Button, Input, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';
	import { passwordStore } from '$stores';

	const { changePasswordWithDeviceKeyMutation } = appQueries();

	let oldPassword = '';
	let confirmPassword = '';

	onMount(() => {
		passwordStore.reset();
	});

	$: charCount = $passwordStore.length;
	$: isDisabled = charCount < 8 || confirmPassword !== $passwordStore || oldPassword === '';
</script>

<AppContainer>
	<button class="mb-4 ml-6 flex items-center self-start" on:click={dismissWindow}>
		<img src="/img/arrow-left.svg" alt="Arrow" />
		<span class="ml-2 text-base">Back</span></button
	>
	<Title>Change Password</Title>
	{#if $changePasswordWithDeviceKeyMutation.error}
		<span class="text-xs text-alert">{$changePasswordWithDeviceKeyMutation.error.message}</span>
	{/if}
	<div class="w-full p-6">
		<Input type="password" bind:value={oldPassword} label="Old password" extraProps="mb-6" />
		<Input
			type="password"
			bind:value={$passwordStore}
			label="New password (8 characters min)"
			extraProps="mb-6"
			error={charCount < 8 ? 'Please enter a minimum of 8 characters' : ''}
		/>
		<Input
			type="password"
			bind:value={confirmPassword}
			label="Confirm new password"
			extraProps="mb-4"
			error={confirmPassword !== $passwordStore ? "Password doesn't match" : ''}
		/>
	</div>

	<div class="grid w-full grid-cols-2 gap-5 p-6">
		<Button label="Cancel" onClick={dismissWindow} color="secondary" />
		<Button
			disabled={isDisabled}
			label="Update password"
			onClick={() =>
				$changePasswordWithDeviceKeyMutation.mutate(
					{
						newPassword: $passwordStore,
						oldPassword: oldPassword
					},
					{
						onSuccess: () => {
							goto('/setup-keys/done');
						}
					}
				)}
		/>
	</div>
</AppContainer>
