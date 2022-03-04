<template>
	<Graph ref="sceneComponent"/>
	<Controls @toggleEditor="toggleEditor" :showEditor="showEditor" :loggedIn="$root.store.loggedIn" @login="authenticate" @addLookout="addLookout"/>
	<Editor v-show="showEditor" @save="save"/>
	<Source v-if="$root.store.loggedIn" @update="update" :blocks="channel.contents"/>
	<!--<input type="password" v-model.trim="password">
	<button @click="recover">recover</button>-->
</template>

<script>
import Graph from '@/components/stage/Graph.vue'
import Controls from '@/components/stage/Controls.vue'
import Editor from '@/components/stage/Editor.vue'
import Source from '@/components/stage/Source.vue'

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
			password: '12345678',
			initScene: [],
			needsInit: true,
			showEditor: false
		}
	},
	components: { 
		Graph, Controls, Editor, Source 
	},
	mounted() {
		this.get()
	},
	watch: {
		state(newState) {
			document.body.classList = ['state_'+newState];
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
					this.$root.store.channelTitle = 'loading...'
					break;
				// UPDATED
				case 3:
					this.$root.notify('Channel has been updated.', 'success')
					this.$root.store.channelTitle = this.channel.title
					this.state = 1
					this.$root.store.sceneList = this.initScene ? this.initScene.scene_objects : [];
					this.$root.store.connectionCount = this.initScene ? this.initScene.scene_data.connectionCount : 0;
					if(this.needsInit) this.$refs.sceneComponent.init();
					this.needsInit=false;
					this.$refs.sceneComponent.updateContents(this.channel.contents);
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
		addLookout(){
			this.$refs.sceneComponent.addLookout();
		},
		toggleEditor () {
			this.showEditor = !this.showEditor
		}
	}
}
</script>
<style>
	@import "/assets/css/stage.css";
</style>