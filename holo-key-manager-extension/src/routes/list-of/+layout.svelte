<script>
	import { Title } from '$components';
</script>

<div class="mx-8 my-4">
	<div class="flex items-center">
		<img src={'/img/holo_logo.svg'} alt={'Holo Logo'} class="mr-2 max-w-[48px]" />
		<Title small>Holo Key Manager</Title>
	</div>

	<slot />
</div>
