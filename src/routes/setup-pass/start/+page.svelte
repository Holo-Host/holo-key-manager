<script lang="ts">
	import { Button, Title, AppParagraph } from '$components';
	import { goto } from '$app/navigation';
</script>

<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" class="w-12 my-4" />
<Title>Holo Key Manager</Title>
<div class="border-b-[0.5px] mb-4 border-light-gray w-full">
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
<Button arrow label="First time setup" onClick={() => goto('app-password')} />
<Button label="Import existing keys" onClick={() => null} color="secondary" />
