<script lang="ts">
	import { dismissWindow } from '$helpers';
</script>

<div class="mb-4 flex items-center justify-between">
	<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />
	<button on:click={dismissWindow} class="border-none bg-transparent">
		<img src="/img/close.svg" alt="Close" />
	</button>
</div>
