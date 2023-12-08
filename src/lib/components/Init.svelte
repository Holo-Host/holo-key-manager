<script lang="ts">
	import { Button, AppParagraph } from '$components';
	import { dismissWindow } from '$lib/helpers';

	function redirectToSetup() {
		window.open('setup-pass/start.html', '_blank');
	}
</script>

<div class="m-8">
	<div class="mb-4 flex items-center justify-between">
		<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
		<button on:click={dismissWindow} class="border-none bg-transparent">
			<img src="/img/close.svg" alt="Close" />
		</button>
	</div>

	<div class="flex flex-col items-center justify-center">
		<img src="/img/setup.svg" alt="Setup" class="max-w-[48px]" />
		<h1 class="mt-4 text-2xl font-bold">Setup Required</h1>
		<AppParagraph
			extraProps="my-4 text-center max-w-xs"
			text="You are yet to setup Holo Key Manager. Click “start setup” to begin."
		/>
	</div>

	<Button label="Start setup" onClick={redirectToSetup} extraBottomMargin />
	<Button label="Cancel" onClick={dismissWindow} color="secondary" />
</div>
