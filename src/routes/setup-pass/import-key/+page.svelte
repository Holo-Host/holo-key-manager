<script lang="ts">
	import clsx from 'clsx';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import { sessionStorageQueries } from '$queries';
	import { EncryptedDeviceKeySchema } from '$types';

	const { recoverDeviceKeyMutation } = sessionStorageQueries();

	let passphrase = '';
	let fileName: string;
	let fileContent: string;

	const handleFilesSelect = (e: { detail: { acceptedFiles: File[] } }) => {
		const { acceptedFiles } = e.detail;
		if (acceptedFiles.length === 0) return;

		$recoverDeviceKeyMutation.reset();

		fileName = acceptedFiles[0].name;

		const reader = new FileReader();

		reader.onload = (event) => {
			const parsed = EncryptedDeviceKeySchema.safeParse(event.target?.result);
			if (!parsed.success) return;
			fileContent = parsed.data;
		};

		reader.readAsText(acceptedFiles[0]);
	};

	$: isDisabled = !fileContent || passphrase === '';
</script>

<Title>Import Your Device Seed</Title>
<AppParagraph
	extraProps="my-4 max-w-xs text-center"
	text="Kindly import your device seed file below to recover your Key Manager"
/>
<div class="w-full p-6 px-16">
	<Dropzone
		containerClasses={clsx('flex flex-col items-center justify-center rounded-lg border p-4', {
			'alert-background border-alert': $recoverDeviceKeyMutation.error,
			'border-primary bg-white ': fileContent && !$recoverDeviceKeyMutation.error,
			'border-purple bg-primary-background px-0 py-12': !fileContent
		})}
		inputElement={false}
		on:drop={handleFilesSelect}
		accept=".txt"
		multiple={false}
		disableDefaultStyles={true}
	>
		{#if fileContent}
			<div class=" flex w-full items-center justify-between">
				<p
					class={clsx('font-semibold', {
						'text-base': !$recoverDeviceKeyMutation.error,
						'text-alert': $recoverDeviceKeyMutation.error
					})}
				>
					{fileName}
				</p>
				{#if !$recoverDeviceKeyMutation.error}
					<img src="/img/checkbox.svg" alt="Checkbox" />
				{/if}
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
		<label
			for="passphrase"
			class={clsx('text-s mb-1 font-bold', {
				'text-secondary': !$recoverDeviceKeyMutation.error,
				'text-alert': $recoverDeviceKeyMutation.error
			})}>Passphrase</label
		>
		<input
			bind:value={passphrase}
			type="passphrase"
			placeholder="Enter Passphrase"
			class={clsx('rounded border p-2 outline-none focus:outline-none', {
				'border-black': !$recoverDeviceKeyMutation.error,
				'border-alert': $recoverDeviceKeyMutation.error
			})}
			on:input={() => {
				if ($recoverDeviceKeyMutation.error) {
					$recoverDeviceKeyMutation.reset();
				}
			}}
		/>
		{#if $recoverDeviceKeyMutation.error}
			<span class="mt-2 self-end text-base text-alert">Wrong file or passphrase, try again</span>
		{/if}
	</div>
</div>

<div class="grid w-full grid-cols-2 gap-5 p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button
		disabled={isDisabled}
		label="Submit"
		onClick={() =>
			$recoverDeviceKeyMutation.mutate(
				{
					deviceKey: fileContent,
					passphrase
				},
				{
					onSuccess: () => {
						goto('/app-password');
					}
				}
			)}
	/>
</div>
