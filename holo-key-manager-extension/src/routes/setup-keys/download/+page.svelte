<script lang="ts">
	import fileSaver from 'file-saver';
	import JSZip from 'jszip';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { Button, Title } from '$components';
	import { uint8ArrayToBase64 } from '$shared/helpers';
	import { keysStore } from '$stores';

	onMount(() => {
		if (
			$keysStore.encodedMaster === null ||
			$keysStore.encodedRevocation === null ||
			$keysStore.encodedDevice === null
		) {
			goto('/setup-pass/start');
		}
	});

	async function download(): Promise<void> {
		const { saveAs } = fileSaver;
		if ($keysStore.encodedMaster && $keysStore.encodedDevice && $keysStore.encodedRevocation) {
			const files = [
				{
					name: 'master.txt',
					data: uint8ArrayToBase64($keysStore.encodedMaster)
				},
				{
					name: 'device.txt',
					data: uint8ArrayToBase64($keysStore.encodedDevice)
				},
				{
					name: 'revocation.txt',
					data: uint8ArrayToBase64($keysStore.encodedRevocation)
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

<Title>Save seed and key files</Title>
<p class="mx-auto mb-6 max-w-md text-center text-base font-light text-secondary">
	All done, please save your files. Remember to back them up an external drive you store in a secure
	location. Learn more about seed and key files by
	<a href="https://holo.host/faq/" target="_blank" class="font-semibold text-primary underline">
		visiting our FAQ
	</a>
	page.
</p>
<Button label="Save" onClick={download} />
