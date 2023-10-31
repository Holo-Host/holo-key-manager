<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { passphrase } from '$stores';
	import JSZip from 'jszip';
	import fileSaver from 'file-saver';
	import type { Writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import AppParagraph from '$components/AppParagraph.svelte';
	import Title from '$components/Title.svelte';
	import Button from '$components/Button.svelte';
	import { generateKeys } from '$helpers/generate-keys';

	const passphraseStore = getContext<Writable<string>>(passphrase);

	onMount(() => {
		if ($passphraseStore === '') {
			goto('/setup/start');
		}
	});

	async function download(): Promise<void> {
		const { saveAs } = fileSaver;
		const { master, device, revocation } = await generateKeys($passphraseStore);
		const files = [
			{ name: 'master.txt', data: new TextDecoder().decode(master) },
			{ name: 'device.txt', data: new TextDecoder().decode(device) },
			{ name: 'revocation.txt', data: new TextDecoder().decode(revocation) }
		];
		const zip = new JSZip();
		files.forEach((file) => zip.file(file.name, file.data));
		const content = await zip.generateAsync({ type: 'blob' });

		saveAs(content, 'keys.zip');
	}
</script>

<img src="/img/download.svg" alt="Download" class="w-12 my-4" />
<Title>Generate Seed & Key files</Title>
<AppParagraph
	extraProps="mx-auto text-center max-w-md"
	text="Click the button below to generate and save your seed and key files. Please save this on your external hard drive or USB drive."
/>
<p class="text-secondary text-base font-bold text-center mt-4">Context:</p>
<AppParagraph
	extraProps="mx-auto text-center"
	text="Remember, you will need BOTH the seed and your passphrase to restore any keys that are created from this seed. Remember to store your drives in save places like a safe, you can also save copies of this on digital drives"
/>
<img src="/img/padlock.svg" alt="Padlock" class="my-6" />
<Button label="Generate" onClick={download} />
