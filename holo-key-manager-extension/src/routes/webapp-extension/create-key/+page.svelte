<script lang="ts">
	import { AppParagraph, Button, Input } from '$components';
	import { isValidEmail } from '$helpers';
	import { extractHAppDetailsFromUrl } from '$helpers';
	import { sessionStorageQueries } from '$queries';

	const { applicationKeyMutation } = sessionStorageQueries();
	let email = '';
	let registrationCode = '';
	let keyName = '';
	let errors = { email: '', registrationCode: '', keyName: '' };

	const validateField = (field: string, value: string, validator: (value: string) => boolean) => {
		errors = {
			...errors,
			[field]: value === '' ? 'This field is required' : validator(value) ? '' : 'Invalid value'
		};
	};

	const validateAllFields = () => {
		validateField('email', email, isValidEmail);
		validateField('registrationCode', registrationCode, () => true);
		validateField('keyName', keyName, () => true);
		return Object.values(errors).every((error) => error === '');
	};
</script>

<div class="flex flex-col items-center justify-center">
	<img src="/img/holo_logo.svg" alt="Holo Logo" />
	<h1 class="mt-4 text-2xl font-bold">Sign up</h1>
	<AppParagraph
		extraProps="my-4 max-w-48 text-center"
		text="Please provide the following details below"
	/>
</div>

<Input label="Email:" bind:value={email} extraProps="mb-4" error={errors.email} />
<Input
	label="Registration Code:"
	bind:value={registrationCode}
	extraProps="mb-4"
	error={errors.registrationCode}
/>
<Input label="Name This Key:" bind:value={keyName} extraProps="mb-4" error={errors.keyName} />

{#if $applicationKeyMutation.error}
	<div class="mutation-error">
		<p>Error: {$applicationKeyMutation.error.message}</p>
	</div>
{/if}

<Button
	label="Create keys"
	onClick={() => {
		if (validateAllFields()) {
			$applicationKeyMutation.mutate(
				{ app_key_name: keyName, happId: $extractHAppDetailsFromUrl.happId },
				{
					onSuccess: window.close
				}
			);
		}
	}}
	extraBottomMargin
/>
