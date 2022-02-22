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
				this.axios.get(`https://api.are.na/v2/channels/${this.channelId}?per=100`)
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
								this.axios.get(`https://api.are.na/v2/channels/${this.channel.id}?page=${i}&per=100`)
								.then(response => {
									this.channel.contents = [...this.channel.contents, ...response.data.contents]
								})
								.catch(error => {
									this.$root.notify(error, 'error')
									console.error(error)
									this.$router.push(`/oh/no`)
								})
							}
							this.state = 3
							console.log(this.channel)
						}else{
							this.state = 3
						}
					}	
				})
			}
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
				}else{
					console.error(response.data)
				}
			}).catch(error => { 
				console.error(error)
			})
		},
		
		
		save(){
			
		}
		
		
	}
}
</script>