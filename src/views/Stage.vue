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
			scenePath: `scenes/${this.$route.params.slug}.json`,
			baseSlug: ( this.$route.params.slug.indexOf('_')>0 ? this.$route.params.slug.substr(0, this.$route.params.slug.indexOf('_')) : this.$route.params.slug ),
			channelId: false,
			state: 0, // notfound=-1, setup=0, OK=1, updating=2, updated=3, renamed=4
			channel: false
		}
	},
	mounted() {
		// Check if scene file exists
		this.axios.get(this.scenePath)
		.then(response => {
			this.channelId = response.data.channel.id
			this.update()
		})
		.catch(error => {
			console.error(error)
			this.state = -1
		})
	},
	watch: {
		channel() {
			
			/*
				on change: hier wird erst nach der ersten update schleife ansigned
				wenn das passiert, dann kann nach dem rename gefragt werden
			
				if( this.baseSlug != response.data.channel.slug ){
				// bevor der ganze channel geupdatet wird, erstmal fragen ob channel umbenannt wurde. 
				// wenn ja, scene file neu erstellen mit neuem slug und in alte scene file hinterlege : moved permanelty
				this.$root.notify('The channel name has been changed.')
				rename()
			*/

			this.$root.channelTitle = this.channel.title
		},
		state() {
			switch (this.state) {
				case -1:
					this.$root.notify('No hyperspace found.', 'error')
					this.$router.push(`/not/found`)
					break;
				case 2:
					this.$root.channelTitle = 'loading...'
					break;
				case 3:
					this.$root.notify('Channel has been updated.', 'success')
					console.log(this.channel)
					break;
				case 4:
					this.$root.notify('The channel has been renamed')
					break;
			}
		}
	},
	methods: {
		// for api functions see mixins
	}
}
</script>