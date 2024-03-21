<script lang="ts">
	import { goto } from '$app/navigation';
	import { ActionPage } from '$components';
	import { extractHAppDetailsFromUrl } from '$helpers';
</script>

<ActionPage
	outerWindow={true}
	mainAction={() => goto(`create-key?${new URLSearchParams(window.location.search)}`)}
	mainActionLabel="Connect"
	title="Holo Key Manager"
	subTitle="{$extractHAppDetailsFromUrl.happName} would like to connect to Holo Key Manager"
/>
