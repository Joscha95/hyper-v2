<template>
	<link rel="stylesheet" href="assets/css/stage.css">
	<Header :title="headerTitle" @click="toggleSource" :class="{opened:showSource, disabled:!loggedIn}"/>
	<Controls
		:showEditor="showEditor"
		:loggedIn="loggedIn"
		:email="email"
		:password="password"
		v-model:email="email"
		v-model:password="password"
		@login="authenticate(false)"
		@logout="authenticate(false, 'logout')"
		@recover="recover"
		@toggleEditor="toggleEditor"
	/>
	<Editor v-show="showEditor" @save="save"/>
	<Source v-if="loggedIn && showSource" @update="update" :blocks="channel.contents"/>
	<Graph :showEditor="showEditor" :loggedIn="loggedIn" ref="sceneComponent"/>
</template>

<script>
import Header from '@/components/Header.vue'
import Controls from '@/components/stage/Controls.vue'
import Editor from '@/components/stage/Editor.vue'
import Source from '@/components/stage/Source.vue'
import Graph from '@/components/stage/Graph.vue'

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
			loggedIn: false,
			email: '',
			password: '',
			initScene: [],
			needsInit: true,
			showSource: true,
			showEditor: false,
			headerTitle: '',
			store:this.$root.store
		}
	},
	components: {
		Header, Controls, Editor, Source, Graph
	},
	mounted() {
		this.get();
		window.addEventListener('keydown',(e)=>{
			if(e.which == 83 && (e.ctrlKey||e.metaKey) || (e.which == 19)) {
				e.preventDefault()
				e.stopPropagation()
				this.save()
			}
		})
	},
	watch: {
		state(newState) {
			document.body.classList = ['state_'+newState]
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
					this.headerTitle = 'loading...'
					break;
				// UPDATED
				case 3:
					this.$root.notify('Channel has been updated.', 'success')
					this.state = 1
					this.headerTitle = this.channel.title
					//console.log(this.channel)
					if(this.needsInit) {
						this.$refs.sceneComponent.init();
					}else {
						this.$refs.sceneComponent.updateContents(this.channel.contents)
					}
					this.needsInit=false
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
		toggleSource () {
			if(this.loggedIn){
				this.showSource = !this.showSource
			}
		},
		toggleEditor () {
			this.showEditor = !this.showEditor
		}
	}
}
</script>

<style>
#notification.default {
	background: white;
}
</style>