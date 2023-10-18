<script lang="ts">
	export let label: string;
	export let onClick: () => void;
	export let color: 'primary' | 'secondary' = 'primary';
	export let arrow = false;
</script>

<button
	class="max-w-xs p-2 my-2 rounded-2xl w-full text-base font-bold relative flex justify-center
    items-center {color === 'primary'
		? 'bg-primary text-white'
		: 'bg-white text-gray border border-gray'}"
	on:click={onClick}
>
	<span>{label}</span>
	{#if arrow}
		<img src="/img/arrow.svg" alt="Arrow" class="absolute right-4" />
	{/if}
</button>
