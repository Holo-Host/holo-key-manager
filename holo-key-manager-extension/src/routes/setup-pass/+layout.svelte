<script lang="ts">
	import { page } from '$app/stores';
	import { AppContainer, GoBack } from '$components';
	import { dismissWindow } from '$helpers';
	import { appQueries } from '$queries';

	const { setupDeviceKeyQuery } = appQueries();
	$: if ($setupDeviceKeyQuery.data) {
		dismissWindow();
	}
	const shouldShowGoBack = (pathname: string): boolean =>
		!pathname.includes('start') && !pathname.includes('important');
</script>

<AppContainer>
	{#if shouldShowGoBack($page.url.pathname)}
		<GoBack />
	{/if}
	<slot />
</AppContainer>
