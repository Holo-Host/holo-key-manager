<script lang="ts">
	import clsx from 'clsx';
	import Dropzone from 'svelte-file-dropzone';

	import { goto } from '$app/navigation';
	import { AppParagraph, Button, Title } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';
	import { EncryptedDeviceKeySchema } from '$shared/types';

	const { recoverDeviceKeyMutation } = appQueries();

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
	text="Please import your device seed file below to recover your Key Manager"
/>
{#if $recoverDeviceKeyMutation.error}
	<div class="w-full p-6 px-16">
		<div
			class="flex w-full items-start justify-between rounded-lg border border-alert bg-alert-background p-4"
		>
			<div class="flex flex-col">
				<p class="font-semibold text-alert">Import failed, please try again</p>
				<p class="text-alert">{fileName}</p>
				<button
					class="self-start font-semibold text-alert underline"
					on:click={() => {
						passphrase = '';
						fileContent = '';
						fileName = '';
						$recoverDeviceKeyMutation.reset();
					}}
				>
					Try again
				</button>
			</div>
			<img src="/img/trash.svg" alt="Cloud" />
		</div>
	</div>
{:else}
	<div class="w-full p-6 px-16">
		<Dropzone
			containerClasses={clsx('flex flex-col items-center justify-center rounded-lg border p-4', {
				'border-primary bg-white ': fileContent,
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
					<p class="text-base font-semibold">{fileName}</p>
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
				placeholder="Enter passphrase"
				class="rounded border border-black p-2 outline-none focus:outline-none"
			/>
		</div>
	</div>
{/if}

<div class="grid w-full grid-cols-2 gap-5 p-6">
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
	<Button
		disabled={isDisabled || $recoverDeviceKeyMutation.isError}
		label="Submit"
		onClick={() =>
			$recoverDeviceKeyMutation.mutate(
				{
					deviceKey: fileContent,
					passphrase
				},
				{
					onSuccess: () => {
						goto('/extension-password');
					}
				}
			)}
	/>
</div>
