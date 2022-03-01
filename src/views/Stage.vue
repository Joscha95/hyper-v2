<template>
	<!--<button @click="update">update</button>
	<input type="password" v-model.trim="password">
	<button @click="save">save</button>
	<button @click="recover">recover</button>-->
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
			channel: false,
			password: '',
			scene: {demokey: Date.now()} // TBD: kommt von three
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
					this.$root.popup(`
						The site has been moved due to a renaming of the Are.na channel. You have been forwared to the new address:
						<strong><a href="#">${window.location.origin}/${this.targetSlug}</a></strong>`, 'OK'
					)
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