<script lang="ts">
	export let label: string;
	export let onClick: () => void;
	export let color: 'primary' | 'secondary' = 'primary';
	export let arrow = false;
	export let extraBottomMargin = false;
	export let disabled = false;

	import clsx from 'clsx';
</script>

<button
	class={clsx(
		'relative my-2 flex w-full max-w-xs justify-center rounded-2xl p-2 text-base font-bold',
		{
			'bg-primary-disabled text-white': color === 'primary' && disabled,
			'bg-primary text-white': color === 'primary' && !disabled,
			'border border-secondary bg-white text-secondary': color !== 'primary',
			'mb-4': extraBottomMargin
		}
	)}
	on:click={onClick}
	{disabled}
>
	<span>{label}</span>
	{#if arrow}
		<img src="/img/arrow-right.svg" alt="Arrow" class="absolute right-4" />
	{/if}
</button>
