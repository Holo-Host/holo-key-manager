<script>
	import { Button, AppParagraph } from '$components';
	import { sessionStore } from '$stores';
	import { dismissExtensionWindow } from '$lib/helpers';

	function redirectToSetup() {
		window.open('setup/start.html', '_blank');
	}
</script>

<div class="m-8">
	{#if $sessionStore.session}
		<span>session</span>
	{/if}
	<div class="flex justify-between items-center mb-4">
		<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
		<button on:click={dismissExtensionWindow} class="bg-transparent border-none">
			<img src="/img/close.svg" alt="Close" />
		</button>
	</div>

	<div class="flex flex-col justify-center items-center">
		<img src="/img/setup.svg" alt="Setup" class="max-w-[48px]" />
		<h1 class="font-bold text-2xl mt-4">Setup Required</h1>
		<AppParagraph
			extraProps="my-4 text-center max-w-xs"
			text="You are yet to setup Holo Key Manager. Click “start setup” to begin."
		/>
	</div>

	<Button label="Start setup" onClick={redirectToSetup} extraBottomMargin />
	<Button label="Cancel" onClick={dismissExtensionWindow} color="secondary" />
</div>
