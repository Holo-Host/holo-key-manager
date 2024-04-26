<script lang="ts">
	const goBack = () => window?.history.back();

	export let extraClass = 'ml-6';
</script>

<button class={`${extraClass} mb-4 flex items-center self-start`} on:click={goBack}>
	<img src="/img/arrow-left.svg" alt="Arrow" />
	<span class="ml-2 text-base">Back</span></button
>
