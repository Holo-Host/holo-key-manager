<script lang="ts">
	export let dismiss: () => void;
	export let next: () => void;
</script>

<div class="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-70">
	<div class="bg-white p-10 rounded-md shadow-lg flex flex-col items-center">
		<img src="/img/noun.svg" alt="Noun" />
		<div class="my-4">
			<h2 class="text-xl font-semibold">Important</h2>
		</div>
		<p>Did you remember to write down your passphrase?</p>
		<div class="mt-4 flex flex-col justify-center w-36 mx-auto">
			<button class="bg-tertiary text-white font-bold py-2 px-4 rounded-full m-2" on:click={next}>
				Yes
			</button>
			<button class="underline text-quaternary font-bold py-2 px-4 m-2 bg-white" on:click={dismiss}>
				Go back
			</button>
		</div>
	</div>
</div>
