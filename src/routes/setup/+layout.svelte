<script>
	import { page } from '$app/stores';
	import { setContext } from 'svelte';
	import { passphrase, passphraseStore } from '$stores';

	function dismissExtensionWindow() {
		window.history.back();
	}

	setContext(passphrase, passphraseStore);
</script>

<div
	class="flex flex-col items-center mt-20 w-[576px] border border-light-gray rounded-xl mx-auto py-8"
>
	{#if !$page.url.pathname.includes('start')}
		<button class="self-start ml-6 mb-4 flex items-center" on:click={dismissExtensionWindow}>
			<img src="/img/arrow-left.svg" alt="Arrow" />
			<span class="ml-2 text-base">Back</span></button
		>
	{/if}
	<slot />
</div>
