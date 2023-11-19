<script lang="ts">
	import { onMount } from 'svelte';
	import { Init, Login } from '$components';
	import { sessionStore, passwordExistStore } from '$stores';
	import { derived } from 'svelte/store';
	import { storageService } from '$services';
	import { LOCAL, PASSWORD_WITH_DEVICE_KEY, SESSION, SESSION_DATA } from '$const';

	let loading = true;

	onMount(() => {
		storageService.get(
			{
				key: SESSION_DATA,
				area: SESSION
			},
			(result: unknown) => console.log(result)
		);

		storageService.get(
			{
				key: PASSWORD_WITH_DEVICE_KEY,
				area: LOCAL
			},
			(result: unknown) => console.log(result)
		);
		const storeValue = derived(
			[sessionStore, passwordExistStore],
			([$sessionStore, $passwordExistStore]) => {
				console.log($sessionStore, $passwordExistStore);
				return $sessionStore === null || $passwordExistStore === null;
			}
		);
		storeValue.subscribe(($loading) => {
			loading = $loading;
		});
	});
</script>

{#if loading}
	<span>Loading</span>
{:else if $sessionStore}
	<span>Session</span>
{:else if $passwordExistStore}
	<Login />
{:else}
	<Init />
{/if}
