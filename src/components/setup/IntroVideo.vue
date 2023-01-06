<template>
	<div id="video_wrapper">
		<iframe id="vimeo_iframe" src="https://player.vimeo.com/video/786852603?h=e87798f5f0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="hyperchannel.net Introduction"></iframe>
	</div>
</template>

<script>
	
	export default {
		mounted() {
			let externalScript = document.createElement('script')
			externalScript.setAttribute('src', 'https://player.vimeo.com/api/player.js')
			document.head.appendChild(externalScript)
		}
	}
	
</script>

<style>
	
	#video_wrapper {
		position: relative;
		width: 40rem;
		height: 25rem;
		margin: 5rem auto 10rem auto;
		border: var(--main-border);
	}
	
	#vimeo_iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	@media (max-width:700px) {
		#video_wrapper {
			width: 28.8rem;
			height: 18rem;
		}
	}
	
</style>