<script>
module.exports = {
	methods: {


		get(){
			this.axios.get(process.env.VUE_APP_API_URL+'?r=g&s='+this.$route.params.slug)
			.then(response => {
				if(response.status === 200){
					this.sceneId = response.data.id
					this.channelId = response.data.channel_id
					this.targetSlug = response.data.current_slug
					if( this.$route.params.slug == this.targetSlug ){
						// request slug is the most recent
						this.initScene = response.data.scene

						this.authenticate()
						this.update()
					} else {
						// scene has been moved permanently
						this.state = 4
					}
				}else{
					console.error(response.data)
					this.state = -1
				}
			}).catch(error => {
				console.error(error)
				this.state = -1
			})
		},

		splitSceneObjectFromServer(serverArray){
			const lists = {sceneList:[],forceList:[]}
			serverArray.forEach( (item) => {
				const nsli = {
					h_id:item.h_id,
					name:item.name,
					content: item.content,
					description: item.description,
					isFixed: item.isFixed,
					h_type: item.h_type,
				}
				if (item.h_type=='connection') {
						nsli.sourceID = item.sourceID
						nsli.targetID = item.targetID
						nsli.initDistance = item.initDistance
					} else if(item.h_type=='content') {
						nsli.a_id =  item.a_id
						nsli.class =  item.class
						nsli.imageUrl = item.imageUrl
					}
				lists.sceneList.push(nsli)

				const nfli = {
					h_id:item.h_id,
					h_type: item.h_type,
					x: item.x,
					y: item.y,
					z: item.z,
					fx: item.fx,
					fy: item.fy,
					fz: item.fz
				}

				if(item.h_type=='lookout') {
					nfli.rx = item.rx
					nfli.ry = item.ry
					nfli.rz = item.rz
				} else if(item.h_type=='connection') {
					nfli.links = item.links.map((l) => {
						return{
						source : l.source,
						target : l.target,
						distance : l.distance,
						name:  l.name,
						h_type: l.h_type,
						h_id: l.h_id,
					}})
				}

				lists.forceList.push(nfli)
			})

			return lists;
		},


		update(){
			// only proceed when no update is currently in progress
			if( this.state != 2 ){
				this.state = 2
				const checkSlug = ( this.targetSlug.indexOf('_')>0 ? this.targetSlug.substr(0, this.targetSlug.indexOf('_')) : this.targetSlug )
				this.axios.get(`https://api.are.na/v2/channels/${this.channelId}?per=100&t=${Date.now()}`)
				.then(response => {
					// the first 100 blocks have been recieved
					// check if channel has been renamed
					if( checkSlug != response.data.slug) {
						this.targetSlug = response.data.slug
						this.state = 5
					}
					this.channel = response.data
				})
				.catch(error => {
					console.error(error)
					this.$router.push(`/oh/no`)
				})
				.then(() => {
					// if channel has more than 100 blocks, iterate get requests
					if( this.state == 2 ){
						if( this.channel.length > 100 ){
							const page = Math.ceil(this.channel.length/100)
							for (let i = 2; i <= page; i++) {
								this.axios.get(`https://api.are.na/v2/channels/${this.channel.id}?page=${i}&per=100&t=${Date.now()}`)
								.then(response => {
									this.channel.contents = [...this.channel.contents, ...response.data.contents]
								})
								.catch(error => {
									this.$root.notify(error, 'error')
									console.error(error)
									this.$router.push(`/oh/no`)
								})
							}
							this.channel.contents.reverse()
							this.state = 3
						}else{
							this.channel.contents.reverse()
							this.state = 3
						}
					}
				})
			}
		},


		block(id){
			return this.channel.contents.find(block => this.channel.contents.id = id)
		},


		rename(){
			this.axios.post(
				process.env.VUE_APP_API_URL + '?r=cs',
				{ id: this.sceneId, slug: this.targetSlug },
				{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
			).then(response => {
				if(response.status === 200){
					this.targetSlug = response.data.slug
					this.$router.push(`/${response.data.slug}`)
					this.state = 1
				}else{
					console.error(response.data)
				}
			}).catch(error => {
				console.error(error)
			})
		},


		authenticate(silent = true, logout = false){

			this.axios.post(
				process.env.VUE_APP_API_URL + '?r=a',
				{ id: logout ? 'logout' : this.sceneId, email: this.email, password: this.password },
				{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
			).then(response => {
				if(response.status === 200){
					// logged in
					this.login()
					this.email = response.data.email
					if(!silent){ this.$root.notify(response.data.message, 'success') }
				}else if(response.status === 205){
					// logged out
					this.logout()
					if(!silent){ this.$root.notify(response.data.description) }
				}else{
					this.logout()
					console.error(response.data)
				}
			}).catch(error => {
				if(error.response.status === 400){
					this.logout()
					if(!silent){ this.$root.notify(error.response.data.description, 'error') }
				}else{
					this.logout()
					console.error(error)
				}
			})
		},
		login(){
			this.loggedIn = true
			this.$root.store.loggedIn = true
		},
		logout(){
			this.loggedIn = false
			this.$root.store.loggedIn = false
			this.email = ''
			this.password = ''
			this.showSource = false
			this.showEditor = false
		},


		save(_scene_objects){
			if(this.loggedIn) {

				const scene_data={
					scene_data:{
						threadIds:this.$root.store.thread.map((n)=> n.h_id),
						sceneSettings:this.$root.store.sceneSettings
					},
					scene_objects:_scene_objects
				}
				if( this.state == 2 ) {
					this.$root.notify('Update in progress.')
				} else {
					this.axios.post(
						process.env.VUE_APP_API_URL + '?r=s',
						{ id: this.sceneId, email: this.email, password: this.password, scene: scene_data },
						{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
					).then(response => {
						if(response.status === 200){
							this.$root.notify(response.data.message, 'success')
							this.$root.store.unsavedChanges=0;
						}else{
							console.error(response.data)
						}
					}).catch(error => {
						if(error.response.status === 400){
							this.$root.notify(error.response.data.description, 'error')
						}else{
							console.error(error)
						}
					})
				}
			} else {
				this.$root.notify('Please log in.')
			}
		},


		recover(){
			if( this.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ){
				this.axios.post(
					process.env.VUE_APP_API_URL + '?r=r',
					{ id: this.sceneId, email: this.email },
					{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
				).then(response => {
					if(response.status === 200){
						this.$root.notify(response.data.message, 'success', 7000)
					}else{
						console.error(response.data)
					}
				}).catch(error => {
					if(error.response.status === 400){
						this.$root.notify(error.response.data.description, 'error')
					}else{
						console.error(error)
					}
				})
			} else {
				this.$root.notify('Please enter a valid Email')
			}
		}


	}
}
</script>