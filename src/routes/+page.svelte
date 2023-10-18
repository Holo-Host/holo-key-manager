<script>
	import Button from '$components/Button.svelte';
	import AppParagraph from '$components/AppParagraph.svelte';
	function redirectToSetup() {
		window.open('setup.html', '_blank');
	}

	function dismissExtensionWindow() {
		return window.close();
	}
</script>

<div class="m-8">
	<div class="flex justify-between items-center mb-4">
		<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
		<button on:click={dismissExtensionWindow} style="background: none; border: none;">
			<img src="/img/close.svg" alt="Close" />
		</button>
	</div>

	<div class="flex flex-col justify-center items-center">
		<img src="/img/setup.svg" alt="Close" class="max-w-[48px]" />
		<p class="font-bold text-2xl mt-4">Setup Required</p>
		<AppParagraph
			extraProps="my-4 text-center"
			text="You are yet to setup Holo Key Manager. Click “start setup” to begin."
		/>
	</div>

	<Button label="Start setup" onClick={redirectToSetup} />
	<Button label="Cancel" onClick={dismissExtensionWindow} color="secondary" />
</div>
