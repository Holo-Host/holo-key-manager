<script lang="ts">
	export let text: string;
	export let extraProps = '';
</script>

<p class="text-base text-gray font-normal max-w-xs {extraProps}">
	{text}
</p>
