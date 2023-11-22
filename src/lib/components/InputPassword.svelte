<script lang="ts">
	import clsx from 'clsx';

	export let value = '';
	export let extraProps = '';
	export let label = '';
	export let error = '';
</script>

<div class={clsx('flex flex-col w-full border-black border-b-[0.5px]', extraProps)}>
	<div class="flex justify-between items-center mb-1">
		<label for="password" class="text-base text-secondary">{label}</label>
		<span class="text-xs text-alert">{error}</span>
	</div>
	<input bind:value type="password" class="outline-none focus:outline-none" />
</div>
