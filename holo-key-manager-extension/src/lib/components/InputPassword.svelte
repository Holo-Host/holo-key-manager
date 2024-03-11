<script lang="ts">
	import clsx from 'clsx';

	export let value = '';
	export let extraProps = '';
	export let label = '';
	export let error = '';
</script>

<div class={clsx('flex w-full flex-col border-b-[0.5px] border-black', extraProps)}>
	<div class="mb-1 flex items-center justify-between">
		<label for="password" class="text-base text-secondary">{label}</label>
		<span class="text-xs text-alert">{error}</span>
	</div>
	<input bind:value type="password" class="outline-none focus:outline-none" />
</div>
