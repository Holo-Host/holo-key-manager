<script lang="ts">
	import { onMount } from 'svelte';

	export let delay = 2000;
	export let tooltipText = '';

	let showTooltip = false;
	let hovered = false;
	let tooltipTimeout: ReturnType<typeof setTimeout> | undefined;
	let tooltipPosition = { top: 0, left: 0 };

	const handleMouseEnter = (event: MouseEvent) => {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		tooltipPosition = { top: rect.bottom, left: rect.left };

		tooltipTimeout = setTimeout(() => {
			hovered = true;
			showTooltip = true;
		}, delay);
	};

	const handleMouseLeave = () => {
		if (tooltipTimeout) {
			clearTimeout(tooltipTimeout);
		}
		showTooltip = false;
		hovered = false;
	};

	onMount(() => {
		return () => {
			if (tooltipTimeout) {
				clearTimeout(tooltipTimeout);
			}
		};
	});
</script>

<div
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	class="relative cursor-pointer"
	role="tooltip"
>
	<slot />
	{#if showTooltip && hovered}
		<div
			class={`absolute z-50 max-w-[200px] rounded-lg border border-gray-300 bg-gray-100 p-2 text-xs text-gray-700 shadow-lg top-[${tooltipPosition.top}px] left-[${tooltipPosition.left}px]`}
		>
			<span class="break-words">{tooltipText}</span>
		</div>
	{/if}
</div>
