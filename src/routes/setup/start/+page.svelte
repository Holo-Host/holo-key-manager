<script>
	import Button from '$components/Button.svelte';
	import AppParagraph from '$components/AppParagraph.svelte';
	import { goto } from '$app/navigation';
</script>

<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" class="w-12 my-4" />
<h1 class="text-4xl font-bold text-center">Holo Key Manager</h1>
<div class="border-b-[0.5px] my-4 border-light-gray w-full">
	<AppParagraph extraProps="mx-auto text-center max-w-xs" text="Welcome to Holo Key Manager." />
	<AppParagraph
		extraProps="mx-auto text-center max-w-xs mb-4"
		text="Let’s setup up your hApps key manager."
	/>
</div>
<AppParagraph
	extraProps="my-4 max-w-xs"
	text="Holo Key Manager is a secure key manager for creating and managing Holochain keys. Get easy access to all your keys. You can set up and manager one or more keys for each application"
/>
<AppParagraph
	extraProps="my-4 max-w-xs"
	text="First time user? Select “first time setup” below. If you have already setup the key manager in the past you can select “Import existing keys"
/>
<Button arrow label="First time setup" onClick={() => goto('/setup/enter-passphrase')} />
<Button label="Import existing keys" onClick={() => null} color="secondary" />
