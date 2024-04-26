<script lang="ts">
	import { page } from '$app/stores';
	import { AppContainer, GoBack } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';

	const { setupDeviceKeyQuery } = appQueries();
	$: if ($setupDeviceKeyQuery.data) {
		dismissWindow();
	}
</script>

<AppContainer>
	{#if !$page.url.pathname.includes('start')}
		<GoBack />
	{/if}
	<slot />
</AppContainer>
