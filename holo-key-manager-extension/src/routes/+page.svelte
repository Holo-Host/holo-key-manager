<script lang="ts">
	import { onMount } from 'svelte';

	import { ActionPage, Login } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';
	import { isChromePermissionsSafe } from '$shared/helpers';

	const { sessionQuery, setupDeviceKeyQuery } = sessionStorageQueries();
	$: isLoading = $sessionQuery.isFetching || $setupDeviceKeyQuery.isFetching;
	$: hasSessionData = $sessionQuery.data;
	$: hasSetupData = $setupDeviceKeyQuery.data;

	const openInNewTab = (url: string) => () => window.open(url, '_blank');
	const redirectToChangePassword = openInNewTab('change-password.html');
	const redirectToSetup = openInNewTab('/setup-pass/start.html');

	let permissionGranted = false;

	onMount(async () => {
		if (isChromePermissionsSafe()) {
			const permissions = await chrome.permissions.getAll();
			permissionGranted = permissions.origins?.includes('*://localhost/*') ?? false;
		}
	});

	const requestPermission = async () => {
		if (isChromePermissionsSafe()) {
			const granted = await chrome.permissions.request({ origins: ['*://localhost/*'] });
			permissionGranted = granted;
		}
	};
</script>

{#if isLoading}
	<span>Loading</span>
{:else if !permissionGranted}
	<ActionPage
		mainAction={requestPermission}
		mainActionLabel="Request Permissions"
		title="Permission Required"
		subTitle="Holo Key Manager needs additional permissions. Click “Request Permissions” to proceed."
	/>
{:else if hasSessionData}
	<div class="m-8">
		<div class="mb-4 flex items-center justify-between">
			<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
			<button on:click={dismissWindow} class="border-none bg-transparent">
				<img src="/img/close.svg" alt="Close" />
			</button>
		</div>
		<h1 class="mt-4 text-2xl font-bold">Holo Key Manager</h1>
		<button on:click={redirectToChangePassword} class="text-blue-500 hover:text-blue-800">
			Change Password
		</button>
	</div>
{:else if hasSetupData}
	<Login />
{:else}
	<ActionPage
		mainAction={redirectToSetup}
		mainActionLabel="Setup"
		title="Setup Required"
		subTitle="You are yet to setup Holo Key Manager. Click “start setup” to begin."
	/>
{/if}
