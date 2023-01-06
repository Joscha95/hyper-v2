<template>
	<router-link to="/about" class="header_nav_link">About</router-link>
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