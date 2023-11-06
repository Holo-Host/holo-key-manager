<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { passphrase } from '$stores';
	import JSZip from 'jszip';
	import fileSaver from 'file-saver';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import Button from '$components/Button.svelte';
	import { useGeneratedKeys } from '$queries';
	import Title from '$components/Title.svelte';
	import AppParagraph from '$components/AppParagraph.svelte';

	const passphraseStore = getContext<Writable<string>>(passphrase);

	const { generatedKeysQuery } = useGeneratedKeys();

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup/start');
		}
	});

	async function download(): Promise<void> {
		const { saveAs } = fileSaver;
		const files = [
			{ name: 'master.txt', data: new TextDecoder().decode($generatedKeysQuery.data?.master) },
			{ name: 'device.txt', data: new TextDecoder().decode($generatedKeysQuery.data?.device) },
			{
				name: 'revocation.txt',
				data: new TextDecoder().decode($generatedKeysQuery.data?.revocation)
			}
		];
		const zip = new JSZip();
		files.forEach((file) => zip.file(file.name, file.data));
		const content = await zip.generateAsync({ type: 'blob' });

		saveAs(content, 'keys.zip');
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
