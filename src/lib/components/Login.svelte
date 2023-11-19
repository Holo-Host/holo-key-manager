<script>
	import { Button, AppParagraph } from '$components';
	import { dismissWindow } from '$lib/helpers';
	import { sessionStorageQueries } from '$queries';
	let password = '';

	const { signInMutation } = sessionStorageQueries();

	async function login() {
		$signInMutation.mutate(password, {
			onError: () => alert('Invalid password')
		});
	}
</script>

<div class="m-8">
	<div class="flex justify-between items-center mb-4">
		<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
		<button on:click={dismissWindow} class="bg-transparent border-none">
			<img src="/img/close.svg" alt="Close" />
		</button>
	</div>

	<div class="flex flex-col justify-center items-center">
		<img src="/img/logo.svg" alt="Login" class="max-w-[48px]" />
		<h1 class="font-bold text-2xl mt-4">Login Required</h1>
		<AppParagraph
			extraProps="my-4 text-center max-w-xs"
			text="Please enter your password to login."
		/>
		<input bind:value={password} type="password" class="my-4" placeholder="Enter password" />
	</div>

	<Button label="Login" onClick={login} extraBottomMargin />
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
</div>
