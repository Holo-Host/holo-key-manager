<script lang="ts">
	import { Button, LogoCloseBar } from '$components';
	import { dismissWindow, extractDetailsFromUrl } from '$helpers';
	import { appQueries } from '$queries';

	const { messageMutation } = appQueries();
</script>

<div class="mt-4 flex h-screen flex-col">
	<LogoCloseBar />
	<div class="flex flex-col">
		<h1 class="mx-auto mt-4 text-center text-2xl font-bold">Sign message</h1>
	</div>
	<div class="mt-auto">
		<Button
			label="Click to sign a message"
			onClick={() =>
				$messageMutation.mutate(
					{
						happId: $extractDetailsFromUrl.happId,
						message: $extractDetailsFromUrl.message
					},
					{
						onSuccess: dismissWindow
					}
				)}
			extraBottomMargin
		/>
	</div>
</div>
