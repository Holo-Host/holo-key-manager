<script lang="ts">
	import { onMount } from 'svelte';

	export let delay = 1000;
	export let tooltipText = '';
	export let outerContainerId: string | undefined = undefined;

	let showTooltip = false;
	let hovered = false;
	let tooltipTimeout: ReturnType<typeof setTimeout> | undefined;

	const handleMouseEnter = () => {
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

	const adjustTooltipPosition = () => {
		const tooltipElement = document.getElementById('tooltip-content') as HTMLElement;
		if (!tooltipElement) return;

		const tooltipRect = tooltipElement.getBoundingClientRect();
		const outerContainer = outerContainerId ? document.getElementById(outerContainerId) : null;
		const viewportHeight = outerContainer ? outerContainer.clientHeight : window.innerHeight;
		const viewportTop = outerContainer ? outerContainer.getBoundingClientRect().top : 0;

		if (tooltipRect.bottom > viewportHeight + viewportTop) {
			const currentTop = parseFloat(tooltipElement.style.top) || 0;
			tooltipElement.style.top = `${currentTop - 20}px`;
		}
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
	{#if showTooltip && hovered}
		<div
			role="tooltip"
			id="tooltip-content"
			class={`text-gray-7000 absolute z-50 max-w-[280px] rounded-lg border border-gray-300 bg-gray-100 p-2 text-xs shadow-lg`}
			on:mouseenter={adjustTooltipPosition}
		>
			<span class="break-words">{tooltipText}</span>
		</div>
	{/if}
	<slot />
</div>
