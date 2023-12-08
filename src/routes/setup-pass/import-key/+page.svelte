<script lang="ts">
	import { Button, AppParagraph, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import clsx from 'clsx';

	let passphrase = '';
	let error = '';
	let file: File;

	const handleFilesSelect = (e: { detail: { acceptedFiles: File[] } }) => {
		const { acceptedFiles } = e.detail;
		file = acceptedFiles[0];
	};

	$: isDisabled = !file || passphrase === '';
</script>

<Title>Import Your Device Seed</Title>
<AppParagraph
	extraProps="text-center my-4 max-w-xs"
	text="Kindly import your device seed file below to recover your Key Manager"
/>
<div class="w-full p-6 px-16">
	<Dropzone
		containerClasses={clsx('p-4 border rounded-lg flex flex-col justify-center items-center', {
			'bg-white border-primary': file,
			'bg-primary-background py-12 px-0 border-purple': !file
		})}
		inputElement={false}
		on:drop={handleFilesSelect}
		accept=".txt"
		multiple={false}
		disableDefaultStyles={true}
	>
		{#if file}
			<div class=" flex w-full items-center justify-between">
				<p class="text-base font-semibold">{file?.name}</p>
				<img src="/img/checkbox.svg" alt="Checkbox" />
			</div>
			<div class="mt-2 flex w-full items-center justify-between">
				<div class="h-2 w-full rounded bg-primary-background">
					<div class="h-2 w-full rounded bg-primary" />
				</div>
				<p class="ml-2 text-base font-semibold">100%</p>
			</div>
		{:else}
			<img src="/img/cloud.svg" alt="Cloud" />
			<div class="text-center">
				<p class="mt-2 text-base font-light text-secondary">
					<span class="font-bold text-primary">Click to import</span>
					or drag and drop your seed file
				</p>
			</div>
		{/if}
	</Dropzone>
	<div class="mt-4 flex w-full flex-col">
		<label for="passphrase" class="text-s mb-1 font-bold text-secondary">Passphrase</label>
		<input
			bind:value={passphrase}
			type="passphrase"
			placeholder="Enter Passphrase"
			class={clsx('rounded border p-2 outline-none focus:outline-none', {
				'border-black': !error,
				'border-alert': error
			})}
		/>
		{#if error !== ''}
			<span class="mt-2 self-end text-base text-alert">{error}</span>
		{/if}
	</div>
</div>

<div class="grid w-full grid-cols-2 gap-5 p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button disabled={isDisabled} label="Submit" onClick={() => null} />
</div>
