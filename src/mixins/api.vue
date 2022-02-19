<script>
module.exports = {
	methods: {
		
		update(){
			// only proceed when no update is currently in progress
			if( this.state != 2 ){
				this.state = 2
				this.axios.get(`https://api.are.na/v2/channels/${this.channelId}?per=100`)
				.then(response => {
					// the first 100 blocks have been recieved
					// assigning the channel will trigger a watcher, that will check if the channel has been renamed
					this.channel = response.data
				})
				.catch(error => {
					console.error(error)
					this.$router.push(`/oh/no`) 
				})
				.then(() => {
					// if channel has more than 100 blocks, iterate get requests
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
				})
			}
		},
		
		rename(){
			
		}

	}
}
</script>