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


		save(){
			if(this.password) {

				const scene_save = this.$root.store.sceneList.map((n)=> {
					const newNode= {
						h_id: n.h_id,
						name: n.name,
						to: n.to.map((t)=>t.h_id),
						val: n.val,
						from: n.from.map((f) => f.h_id),
						content: n.content,
						isFixed: n.isFixed,
						x: n.x,
						y: n.y,
						z: n.z,
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
					} else {
						newNode.a_id =  n.a_id
						newNode.class =  n.class
						newNode.imageUrl = n.imageUrl
					}

					return newNode;
				})

				if( this.state == 2 ) {
					this.$root.notify('Update in progress.')
				} else {
					this.axios.post(
						process.env.VUE_APP_API_URL + '?r=s',
						{ id: this.sceneId, password: this.password, scene: scene_save },
						{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
					).then(response => {
						if(response.status === 200){
							this.$root.notify(response.data.message, 'success')
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
				this.$root.notify('Please enter a password.')
			}
		},


		recover(){
			var email = prompt('Please enter the mail address for this scene.')
			if( email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ){
				this.axios.post(
					process.env.VUE_APP_API_URL + '?r=r',
					{ id: this.sceneId, email: email },
					{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
				).then(response => {
					if(response.status === 200){
						this.$root.notify(response.data.message, 'success')
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
				this.$root.notify('The entered address it not a valid mail address.', 'error')
			}
		}


	}
}
</script>