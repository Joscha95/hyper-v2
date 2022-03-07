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
						this.$root.store.sceneList = this.initScene ? this.initScene.scene_objects : [];
						this.$root.store.threadIds = this.initScene && this.initScene.scene_data.threadIds ? this.initScene.scene_data.threadIds : [];
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


		save(){
			if(this.loggedIn) {

				const scene_objects = this.$root.store.sceneList.map((n)=> {
					const newNode= {
						h_id: n.h_id,
						name: n.name,
						val: n.val,
						content: n.content,
						description: n.description,
						isFixed: n.isFixed,
						x: n.x,
						y: n.y,
						z: n.z,
						fx: n.fx,
						fy: n.fy,
						fz: n.fz,
						h_type: n.h_type,
					}

					if (n.h_type=='connection') {
						newNode.links = n.links.map((l) => {
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
				newNode.rx = n.rx
				newNode.ry = n.ry
				newNode.rz = n.rz
					} else {
						newNode.a_id =  n.a_id
						newNode.class =  n.class
						newNode.imageUrl = n.imageUrl
					}

					return newNode;
				})

				const scene_data={
					scene_data:{
						threadIds:this.$root.store.thread.map((n)=> n.h_id)
					},
					scene_objects:scene_objects
				}

				console.log(scene_data);

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