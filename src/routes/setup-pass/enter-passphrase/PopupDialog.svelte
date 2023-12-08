<script lang="ts">
	export let dismiss: () => void;
	export let next: () => void;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70">
	<div class="flex flex-col items-center rounded-md bg-white p-10 shadow-lg">
		<img src="/img/noun.svg" alt="Noun" />
		<div class="my-4">
			<h2 class="text-xl font-semibold">Important</h2>
		</div>
		<p>Did you remember to write down your passphrase?</p>
		<div class="mx-auto mt-4 flex w-36 flex-col justify-center">
			<button class="m-2 rounded-full bg-tertiary px-4 py-2 font-bold text-white" on:click={next}>
				Yes
			</button>
			<button class="m-2 bg-white px-4 py-2 font-bold text-quaternary underline" on:click={dismiss}>
				Go back
			</button>
		</div>
	</div>
</div>
