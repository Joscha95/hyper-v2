<template>
	<nav id="setup_nav">
		<router-link to="/retrieve" class="header_nav_link">Search</router-link>
		<router-link to="/about" class="header_nav_link">About</router-link>
	</nav>
	<Setup />
	<IntroVideo />
</template>

<script>
import Setup from '@/components/setup/Setup.vue'
import IntroVideo from '@/components/setup/IntroVideo.vue'

export default {
	components: { Setup, IntroVideo }
}
</script>