<template>
	<router-link to="/about" class="header_nav_link">About</router-link>
	<Setup />
</template>

<script>
import Setup from '../components/Setup.vue'

export default {
	components: { Setup }
}
</script>