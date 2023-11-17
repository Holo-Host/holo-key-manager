<script>
	import { page } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import { passphrase, passphraseStore } from '$stores';
	import { createIsAuthenticated, dismissWindow } from '$helpers';

	const goBack = () => window.history.back();

	setContext(passphrase, passphraseStore);

	$: allowGoBack = !(
		$page.url.pathname.includes('start') || $page.url.pathname.includes('download')
	);

	const isAuthenticated = createIsAuthenticated();

	onMount(() => {
		const unsubscribe = isAuthenticated.subscribe(($isAuthenticated) => {
			if ($isAuthenticated) {
				dismissWindow();
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div
	class="flex flex-col items-center mt-20 w-[576px] border border-light-gray rounded-xl mx-auto py-8"
>
	{#if allowGoBack}
		<button class="self-start ml-6 mb-4 flex items-center" on:click={goBack}>
			<img src="/img/arrow-left.svg" alt="Arrow" />
			<span class="ml-2 text-base">Back</span></button
		>
	{/if}
	<slot />
</div>
