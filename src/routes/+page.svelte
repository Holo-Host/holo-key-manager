<script>
	import { onMount } from 'svelte';
	import { Init, Login } from '$components';
	import { sessionStore, passwordExistStore } from '$stores';
	import { derived } from 'svelte/store';

	let loading = true;

	onMount(() => {
		const storeValue = derived(
			[sessionStore, passwordExistStore],
			([$sessionStore, $passwordExistStore]) =>
				$sessionStore === null || $passwordExistStore === null
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
