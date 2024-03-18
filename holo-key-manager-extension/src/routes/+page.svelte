<script lang="ts">
	import { ActionPage, Login } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupDeviceKeyQuery } = sessionStorageQueries();
	$: isLoading = $sessionQuery.isFetching || $setupDeviceKeyQuery.isFetching;
	$: hasSessionData = $sessionQuery.data;
	$: hasSetupData = $setupDeviceKeyQuery.data;

	const openInNewTab = (url: string) => () => window.open(url, '_blank');
	const redirectToChangePassword = openInNewTab('change-password.html');
	const redirectToSetup = openInNewTab('setup-pass/start.html');
</script>

{#if isLoading}
	<span>Loading</span>
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
