<script lang="ts">
	import clsx from 'clsx';

	export let value = '';
	export let extraProps = '';
	export let label = '';
	export let placeholder = '';
	export let error = '';
	export let type: 'text' | 'password' = 'text';
</script>

<div class={clsx('flex w-full flex-col border-b-[0.5px] border-black', extraProps)}>
	<div class="mb-1 flex items-center justify-between">
		<label for={label.toLowerCase().replace(/\s+/g, '-')} class="text-base text-secondary"
			>{label}</label
		>
		<span class="text-xs text-alert">{error}</span>
	</div>
	{#if type === 'password'}
		<input
			bind:value
			{placeholder}
			id={label.toLowerCase().replace(/\s+/g, '-')}
			type="password"
			class="outline-none focus:outline-none"
		/>
	{:else}
		<input
			bind:value
			{placeholder}
			id={label.toLowerCase().replace(/\s+/g, '-')}
			class="outline-none focus:outline-none"
		/>
	{/if}
</div>
