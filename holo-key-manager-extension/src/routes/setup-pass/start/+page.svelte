<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
</script>

<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" class="my-4 w-12" />
<Title>Holo Key Manager</Title>
<AppParagraph
	extraProps="my-4 max-w-xs"
	text="Holo Key Manager is a safe place to set up and manage keys for Holochain apps. Get started below."
/>
<Button arrow label="First time set up" onClick={() => goto('/extension-password')} />
<Button label="Import existing keys" onClick={() => goto('import-key')} color="secondary" />
