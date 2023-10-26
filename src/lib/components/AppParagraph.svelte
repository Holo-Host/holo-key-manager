<script lang="ts">
	export let text: string;
	export let textColor = 'text-secondary';
	export let extraProps = '';
</script>

<p class="{textColor} text-base font-light {extraProps}">
	{text}
</p>
