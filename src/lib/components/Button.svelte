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
		'max-w-xs p-2 my-2 rounded-2xl text-base font-bold relative flex justify-center w-full',
		{
			'bg-primary-disabled text-white': color === 'primary' && disabled,
			'bg-primary text-white': color === 'primary' && !disabled,
			'bg-white text-secondary border border-secondary': color !== 'primary',
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
