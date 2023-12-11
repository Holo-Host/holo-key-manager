<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
</script>

<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" class="my-4 w-12" />
<Title>Holo Key Manager</Title>
<div class="mb-4 w-full border-b-[0.5px] border-light-gray">
	<AppParagraph extraProps="mx-auto max-w-xs text-center" text="Welcome to Holo Key Manager." />
	<AppParagraph
		extraProps="mx-auto mb-4 max-w-xs text-center"
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
<Button arrow label="First time setup" onClick={() => goto('/app-password')} />
<Button label="Import existing keys" onClick={() => goto('import-key')} color="secondary" />
