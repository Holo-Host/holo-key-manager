<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { Button, Title } from '$components';
	import { appQueries } from '$queries';

	const { setupPasswordQuery } = appQueries();

	onMount(() => {
		if ($setupPasswordQuery.data === false) {
			goto('start');
		}
	});
</script>

<img class="mb-12" src="/img/exclamation.svg" alt="Exclamation" />
<Title>Important!</Title>
<p class="mb-8 mt-4 max-w-md text-center font-light text-secondary">
	The next two steps are where you create and save your master seed and key files. It is super
	important for you to
	<span class="font-semibold"
		>save the downloaded files and the passphrase you create here somewhere safe.
	</span>
	It will be used in the future if you need to recover your Holo Key Manager account
</p>
<Button label="I understand" onClick={() => goto('/setup-pass/enter-passphrase')} />
