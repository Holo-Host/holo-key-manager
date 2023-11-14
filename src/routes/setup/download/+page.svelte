<script lang="ts">
	import { onMount } from 'svelte';
	import { keysStore } from '$stores';
	import JSZip from 'jszip';
	import fileSaver from 'file-saver';
	import { Button, Title, AppParagraph } from '$components';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (
			$keysStore.keys.master === null ||
			$keysStore.keys.revocation === null ||
			$keysStore.keys.device === null
		) {
			goto('/setup/start');
		}
	});

	async function download(): Promise<void> {
		const { saveAs } = fileSaver;
		const keys = $keysStore?.keys;
		if (keys?.master && keys?.device && keys?.revocation) {
			const files = [
				{
					name: 'master.txt',
					data: new TextDecoder().decode(keys.master)
				},
				{
					name: 'device.txt',
					data: new TextDecoder().decode(keys.device)
				},
				{
					name: 'revocation.txt',
					data: new TextDecoder().decode(keys.revocation)
				}
			];
			const zip = new JSZip();
			files.forEach((file) => zip.file(file.name, file.data));
			const content = await zip.generateAsync({ type: 'blob' });

			saveAs(content, 'keys.zip');

			keysStore.resetExceptDevice();

			goto('/setup/app-password');
		}
	}
</script>

<img src="/img/check.svg" alt="check" class="w-12 my-4" />

<Title>Save Seed Files and Keys</Title>
<AppParagraph
	extraProps="mx-auto text-center max-w-md"
	text="All done, please save your files. Remember to back them up an external drive you store in a secure location."
/>

<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
<Button label="Save" onClick={download} />
