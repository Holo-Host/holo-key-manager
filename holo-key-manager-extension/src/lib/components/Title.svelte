<script lang="ts">
	import clsx from 'clsx';

	export let small = false;
</script>

<h1 class={clsx('text-center font-bold', small ? 'text-2xl' : 'mb-2 text-3xl')}>
	<slot />
</h1>
