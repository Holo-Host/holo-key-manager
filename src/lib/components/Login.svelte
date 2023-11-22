<script lang="ts">
	import { Button, AppParagraph } from '$components';
	import { dismissWindow } from '$lib/helpers';
	import { sessionStorageQueries } from '$queries';
	import InputPassword from './InputPassword.svelte';
	let password = '';

	const { signInMutation } = sessionStorageQueries();

	async function login() {
		$signInMutation.mutate(password, {
			onError: () => alert('Invalid password')
		});
	}
</script>

<div class="m-8">
	<div class="flex justify-end items-center mb-4">
		<button on:click={dismissWindow} class="bg-transparent border-none">
			<img src="/img/close.svg" alt="Close" />
		</button>
	</div>
	<div class="flex flex-col justify-center items-center">
		<img src="/img/holo_logo.svg" alt="Login" class="w-18 h-18" />
		<h1 class="font-bold text-2xl mt-4">Welcome Back</h1>
		<AppParagraph
			extraProps="my-4 text-center max-w-xs"
			text="Please enter your password to login into Holo Key Manager"
		/>
		<InputPassword bind:value={password} label="Enter password" />
	</div>
	<Button label="Login" onClick={login} extraBottomMargin />
</div>
