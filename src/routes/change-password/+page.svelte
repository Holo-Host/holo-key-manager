<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppContainer, Button, Title } from '$components';
	import InputPassword from '$components/InputPassword.svelte';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const { changePasswordWithDeviceKeyMutation } = sessionStorageQueries();

	let oldPassword = '';
	let confirmPassword = '';
	let password = '';

	$: charCount = password.length;
	$: isDisabled = charCount < 8 || confirmPassword !== password || oldPassword === '';
</script>

<AppContainer>
	<button class="mb-4 ml-6 flex items-center self-start" on:click={dismissWindow}>
		<img src="/img/arrow-left.svg" alt="Arrow" />
		<span class="ml-2 text-base">Back</span></button
	>
	<Title>Manage Password</Title>
	{#if $changePasswordWithDeviceKeyMutation.error}
		<span class="text-xs text-alert">{$changePasswordWithDeviceKeyMutation.error.message}</span>
	{/if}
	<div class="w-full p-6">
		<InputPassword bind:value={oldPassword} label="Old Password" extraProps="mb-6" />
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
			label="Update password"
			onClick={() =>
				$changePasswordWithDeviceKeyMutation.mutate(
					{
						newPassword: password,
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
