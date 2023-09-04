<script>
	function redirectToSetup() {
		// Open a new tab and redirect to 'setup.html'
		window.open('setup.html', '_blank');
	}
</script>

<img src="/img/holo_logo.svg" alt="Holo Key Manager Logo" />

<!-- Button that redirects to setup page -->
<button on:click={redirectToSetup}>Go to Setup</button>
