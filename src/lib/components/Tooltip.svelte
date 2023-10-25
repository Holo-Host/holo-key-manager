<div class="relative cursor-pointer group">
	<slot name="content" />
	<div
		class="absolute invisible group-hover:visible z-10 bottom-full left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 text-secondary text-sm rounded-md transition-opacity opacity-0 group-hover:opacity-100 shadow-lg w-96"
	>
		<slot name="body" />
	</div>
</div>
