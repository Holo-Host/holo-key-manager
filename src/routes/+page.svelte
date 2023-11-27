<script lang="ts">
	import { Init, Login } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupDeviceKeyQuery } = sessionStorageQueries();

	function redirectToChangePassword() {
		window.open('change-password.html', '_blank');
	}
</script>

{#if $sessionQuery.isFetching || $setupDeviceKeyQuery.isFetching}
	<span>Loading</span>
{:else if $sessionQuery.data}
	<div class="m-8">
		<div class="flex justify-between items-center mb-4">
			<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
			<button on:click={dismissWindow} class="bg-transparent border-none">
				<img src="/img/close.svg" alt="Close" />
			</button>
		</div>
		<h1 class="font-bold text-2xl mt-4">Holo Key Manager</h1>
		<button on:click={redirectToChangePassword} class="text-blue-500 hover:text-blue-800"
			>Change Password</button
		>
	</div>
{:else if $setupDeviceKeyQuery.data}
	<Login />
{:else}
	<Init />
{/if}
