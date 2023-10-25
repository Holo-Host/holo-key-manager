<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { passphrase } from '$stores';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	const passphraseStore = getContext<Writable<string>>(passphrase);

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup/start');
		}
	});
</script>

<img src="/img/download.svg" alt="Download" class="w-12 my-4" />
<h1 class="text-4xl font-bold text-center">Generate Seed & Key files</h1>
