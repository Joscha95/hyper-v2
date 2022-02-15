<template>
	<Header />
	<main>
		<router-view />
	</main>
</template>

<script>
	import Header from './components/Header.vue'
	
	export default {
		data() {
			return {
				appName: 'hyper',
				channel: false
			}
		},
		components: { Header }
	}
</script>