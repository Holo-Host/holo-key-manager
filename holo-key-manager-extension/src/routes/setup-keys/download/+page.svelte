<script lang="ts">
	import { encodeHashToBase64 } from '@holochain/client';
	import fileSaver from 'file-saver';
	import JSZip from 'jszip';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { keysStore } from '$stores';

	onMount(() => {
		if (
			$keysStore.keys.encodedMaster === null ||
			$keysStore.keys.encodedRevocation === null ||
			$keysStore.keys.encodedDevice === null
		) {
			goto('/setup-pass/start');
		}
	});

	async function download(): Promise<void> {
		const { saveAs } = fileSaver;
		const keys = $keysStore?.keys;
		if (keys?.encodedMaster && keys?.encodedDevice && keys?.encodedRevocation) {
			const files = [
				{
					name: 'master.txt',
					data: encodeHashToBase64(keys.encodedMaster)
				},
				{
					name: 'device.txt',
					data: encodeHashToBase64(keys.encodedDevice)
				},
				{
					name: 'revocation.txt',
					data: encodeHashToBase64(keys.encodedRevocation)
				}
			];
			const zip = new JSZip();
			files.forEach((file) => zip.file(file.name, file.data));
			const content = await zip.generateAsync({ type: 'blob' });

			saveAs(content, 'keys.zip');

			keysStore.resetAll();

			goto('done');
		}
	}
</script>

<img src="/img/check.svg" alt="check" class="my-4 w-12" />

<Title>Save Seed Files and Keys</Title>
<AppParagraph
	extraProps="mx-auto max-w-md text-center"
	text="All done, please save your files. Remember to back them up an external drive you store in a secure location."
/>

<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
<Button label="Save" onClick={download} />
