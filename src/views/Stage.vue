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
	<Editor v-show="showEditor" @save="preSave" ref="editorComponent"/>
	<Source v-if="loggedIn && showSource" @update="update" :blocks="channel.contents" :channelId="channelId"/>
	<Graph :showEditor="showEditor" :loggedIn="loggedIn" ref="sceneComponent"/>
</template>

<script>
import Header from '@/components/Header.vue'
import Controls from '@/components/stage/Controls.vue'
import Editor from '@/components/stage/Editor.vue'
import Source from '@/components/stage/Source.vue'
import Graph from '@/components/stage/Graph.vue'
import {forceSimulation} from '@/store.js'

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
			loggedIn: true,
			email: 'asd@asd.de',
			password: '12345678',
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
				this.preSave()
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
					if(this.needsInit) {
						const lists = this.initScene ? this.splitSceneObjectFromServer(this.initScene.scene_objects) : {sceneList:[],forceList:[]}
						this.$root.store.sceneList = lists.sceneList;
						this.$root.store.threadIds = this.initScene && this.initScene.scene_data.threadIds ? this.initScene.scene_data.threadIds : [];
						this.$root.store.sceneSettings = this.initScene && this.initScene.scene_data.sceneSettings ? this.initScene.scene_data.sceneSettings : {showCircles:true,backgroundColor:{bottom:'#f0f0f0',top:'#c8c8c8'}}
						forceSimulation.init(lists.forceList);
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
		preSave(){
			const scene_objects = this.$root.store.sceneList.map((n)=> {
				const forceNode=forceSimulation.getNodeById(n.h_id)
				const newNode= {
					h_id: n.h_id,
					name: n.name,
					content: n.content,
					description: n.description,
					isFixed: n.isFixed,
					val: forceNode.val,
					x: forceNode.x,
					y: forceNode.y,
					z: forceNode.z,
					fx: forceNode.fx,
					fy: forceNode.fy,
					fz: forceNode.fz,
					h_type: n.h_type,
				}

				if (n.h_type=='connection') {
					newNode.links = forceNode.links.map((l) => {
						return{
						source : l.source.h_id,
						target : l.target.h_id,
						distance : l.distance,
						name:  l.name,
						h_type: l.h_type,
						h_id: l.h_id,
					}})
					newNode.sourceID = n.sourceID
					newNode.targetID = n.targetID
					newNode.initDistance = n.initDistance
				} else if(n.h_type=='lookout') {
			newNode.rx = forceNode.rx
			newNode.ry = forceNode.ry
			newNode.rz = forceNode.rz
				} else {
					newNode.a_id =  n.a_id
					newNode.class =  n.class
					newNode.imageUrl = n.imageUrl
				}

				return newNode;
			})
			this.save(scene_objects)
		},
		toggleSource () {
			if(this.loggedIn){
				this.showSource = !this.showSource
			}
		},
		toggleEditor () {
			this.showEditor = !this.showEditor
			if (this.showEditor) {
				this.$refs.editorComponent.scrollToSelected()
			}
		}
	}
}
</script>

<style>
#notification.default {
	background: white;
}
</style>