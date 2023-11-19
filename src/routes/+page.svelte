<script lang="ts">
	import { Init, Login } from '$components';
	import { sessionStorageQueries } from '$queries';

	const { sessionQuery, setupQuery } = sessionStorageQueries();
</script>

{#if $sessionQuery.isFetching || $setupQuery.isFetching}
	<span>Loading</span>
{:else if $sessionQuery.data}
	<span>Session</span>
{:else if $setupQuery.data}
	<Login />
{:else}
	<Init />
{/if}
