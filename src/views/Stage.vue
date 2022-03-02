<template>
	<Graph ref="threescene"/>
    <Panel/>
    <AllBlocks :blocks="channel.contents"/>
	<!--<button @click="update">update</button>-->
	<!--<input type="password" v-model.trim="password">
	<button @click="save">save</button>
	<button @click="recover">recover</button>-->
</template>

<script>
import Graph from '@/components/stage/Graph.vue'
import Panel from '@/components/stage/Panel.vue'
import AllBlocks from '@/components/stage/AllBlocks.vue'


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
	components: {
    Graph,
    Panel,
    AllBlocks
  },
	mounted() {
		this.get()
	},
	watch: {
		state() {
			switch (this.state) {
				// NOT FOUND
				case -1:
					this.$root.notify('No hyperspace found.', 'error')
					this.$router.push(`/not/found`)
					break;
				// OK > do nothing
				case 1:
					break;
				// UPDATING
				case 2:
					this.$root.channelTitle = 'loading...'
					break;
				// UPDATED
				case 3:
					this.$root.notify('Channel has been updated.', 'success')
					this.$root.channelTitle = this.channel.title
					this.state = 1
					console.log(this.channel);
					this.$refs.threescene.updateContents(this.channel.contents);
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
<style>
	@import "/assets/css/stage.css";
</style>