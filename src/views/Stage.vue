<template>
	<button @click="update">update scene</button>
</template>

<script>
export default {
	mixins: [
		require('@/mixins/api.vue')
	],
	data() {
		return {
			axios: require('axios').default,
			sceneId: false,
			channelId: false,
			targetSlug: false,
			state: 0, // setup=0, OK=1
			channel: false
		}
	},
	mounted() {
		this.get()
	},
	watch: {
		channel() {
			this.$root.channelTitle = this.channel.title
		},
		state() {
			switch (this.state) {
				// NOT FOUND
				case -1:
					this.$root.notify('No hyperspace found.', 'error')
					this.$router.push(`/not/found`)
					break;
				// UPDATING
				case 2:
					this.$root.channelTitle = 'loading...'
					break;
				// UPDATED
				case 3:
					this.$root.notify('Channel has been updated.', 'success')
					break;
				// MOVED PERMANENTLY
				case 4: 
					this.$router.push(`/${this.targetSlug}`)
					this.update()
					break;
				// CHANNEL RENAMED > SLUG CHANGED
				case 5:
					this.rename()
					break;
			}
		}
	},
	methods: {
		// for api functions see 'mixins/api.vue'
	}
}
</script>