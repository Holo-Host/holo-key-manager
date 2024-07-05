<script lang="ts">
	import { onMount } from 'svelte';

	import { ActionPage, Loading, Login } from '$components';
	import { appQueries } from '$queries';
	import { isChromePermissionsSafe } from '$shared/helpers';

	const { isSignedInToExtensionQuery, setupDeviceKeyQuery } = appQueries();
	$: isLoading = $isSignedInToExtensionQuery.isFetching || $setupDeviceKeyQuery.isFetching;
	$: hasSessionData = $isSignedInToExtensionQuery.data;
	$: hasSetupData = $setupDeviceKeyQuery.data;

	const openInNewTab = (url: string) => () => window.open(url, '_blank');
	const redirectToChangePassword = openInNewTab('change-password.html');
	const redirectToSetup = openInNewTab('/setup-pass/start.html');
	const redirectToListOfHapps = openInNewTab('/list-of/happs.html');

	let permissionGranted = false;

	onMount(async () => {
		if (isChromePermissionsSafe()) {
			const permissions = await chrome.permissions.getAll();
			permissionGranted = permissions.origins?.includes('<all_urls>') ?? false;
		}
	});

	const requestPermission = async () => {
		if (isChromePermissionsSafe()) {
			const granted = await chrome.permissions.request({ origins: ['<all_urls>'] });
			permissionGranted = granted;
		}
	};
</script>

{#if isLoading}
	<Loading />
{:else if !permissionGranted}
	<ActionPage
		mainAction={requestPermission}
		mainActionLabel="Request Permissions"
		title="Permission Required"
		subTitle="Holo Key Manager needs additional permissions. Click “Request Permissions” to proceed."
	/>
{:else if hasSessionData}
	<ActionPage
		mainAction={redirectToListOfHapps}
		mainActionLabel="List of applications"
		secondaryAction={redirectToChangePassword}
		secondaryActionLabel="Change password"
		title="Holo Key Manager"
		subTitle=""
	/>
{:else if hasSetupData}
	<Login />
{:else}
	<ActionPage
		mainAction={redirectToSetup}
		mainActionLabel="Setup"
		title="Setup Required"
		subTitle="Please set up Holo Key Manager to continue."
	/>
{/if}
