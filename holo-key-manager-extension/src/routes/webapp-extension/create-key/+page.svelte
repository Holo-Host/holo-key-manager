<script lang="ts">
	import { AppParagraph, Button, Input } from '$components';
	import { dismissWindow, isValidEmail } from '$helpers';
	import { extractDetailsFromUrl } from '$helpers';
	import { appQueries } from '$queries';

	const { applicationKeyMutation } = appQueries();
	let email = '';
	let registrationCode = '';
	let keyName = '';
	let errors = { email: '', registrationCode: '', keyName: '' };

	const validateField = (field: string, value: string, validator: (value: string) => boolean) =>
		value === ''
			? { ...errors, [field]: 'This field is required' }
			: { ...errors, [field]: validator(value) ? '' : 'Invalid value' };

	const validateAllFields = () => {
		if ($extractDetailsFromUrl.requireEmail) {
			errors = validateField('email', email, isValidEmail);
		}
		if ($extractDetailsFromUrl.requireRegistrationCode) {
			errors = validateField('registrationCode', registrationCode, () => true);
		}
		errors = validateField('keyName', keyName, () => true);
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

{#if $extractDetailsFromUrl.requireEmail}
	<Input label="Email:" bind:value={email} extraProps="mb-4" error={errors.email} />
{/if}
{#if $extractDetailsFromUrl.requireRegistrationCode}
	<Input
		label="Registration Code:"
		bind:value={registrationCode}
		extraProps="mb-4"
		error={errors.registrationCode}
	/>
{/if}
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
				{
					app_key_name: keyName,
					happId: $extractDetailsFromUrl.happId,
					happName: $extractDetailsFromUrl.happName,
					happLogo: $extractDetailsFromUrl.happLogo,
					happUiUrl: $extractDetailsFromUrl.happUiUrl,
					messageId: $extractDetailsFromUrl.messageId,
					origin: $extractDetailsFromUrl.origin,
					email,
					registrationCode
				},
				{
					onSuccess: dismissWindow
				}
			);
		}
	}}
	extraBottomMargin
/>
