<script lang="ts">
	import clsx from 'clsx';

	import { AppParagraph, Button, Input } from '$components';
	import { dismissWindow } from '$lib/helpers';
	import { appQueries } from '$queries';

	let password = '';

	export let outerWindow = false;

	const { signInMutation } = appQueries();
</script>

<div class={clsx(!outerWindow && 'm-8')}>
	{#if !outerWindow}
		<div class="mb-4 flex items-center justify-end">
			<button on:click={dismissWindow} class="border-none bg-transparent">
				<img src="/img/close.svg" alt="Close" />
			</button>
		</div>
	{/if}
	<div class="flex flex-col items-center justify-center">
		<img src="/img/holo_logo.svg" alt="Login" class="w-18 h-18" />
		<h1 class="mt-4 text-2xl font-bold">Welcome Back</h1>
		<AppParagraph
			extraProps="my-4 max-w-xs text-center"
			text="Please enter your password to login into Holo Key Manager"
		/>
		<Input
			type="password"
			error={$signInMutation.error ? 'Invalid password' : ''}
			bind:value={password}
			label="Enter password"
		/>
	</div>
	<Button label="Login" onClick={() => $signInMutation.mutate(password)} extraBottomMargin />
</div>
