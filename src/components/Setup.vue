<template>
	<form @submit.prevent="submit">
		<label>Input the URL of an existing <a href="https://www.are.na/" target="_blank">Are.na</a> Channel:</label>
		<br>
		<input type="text" v-model.trim="input" >
		<br>
		<p id="info">
			<span id="message">{{ message }}</span>
			<a v-if="valid" :href="'https://www.are.na/channel/'+channel.id" id="channel_title" target="_blank">
				{{ channel.title }}
			</a>
		</p>
		<button type="submit" :disabled="!valid">Create hyper</button>
	</form>
</template>

<script>
export default {
	data() {
		return {
			valid: false,
			input: '',
			message: '',
			channel: false,
		}
	},
	watch: {
		input() {
			var slug = this.input
			var slashPos = this.input.lastIndexOf('/')
			if(slashPos != -1){
				// string is probably a url
				// remove trailing slash (edge case)
				if(slashPos == (slug.length-1)){
					slug = slug.substring(0, (slug.length-1))
					slashPos = slug.lastIndexOf('/')
				}
				// get last url bit, ie the slug
				if(slashPos != -1){
					slug = slug.substring(slashPos+1)
					if(slug.length > 0){
						this.searchChannel(slug)
					}
				}
			} else if(slug != '') {
				// string is probably not a url
				// lets try it anyways, maybe the user entered just the slug
				// otherwise the are.na api will return an error anyhow
				this.searchChannel(slug.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).join('-').toLowerCase())
			} else {
				// if user clears the input again
				this.valid = false
				this.message = ''
			}
		}
	},
	methods: {
		async searchChannel(slug, n = 0) {
			this.valid = false
			this.message = 'searching...'
			try {
				const res = await fetch('https://api.are.na/v2/channels/'+slug+'?per='+n)
				const result = (await res.json())
				if(result.id){
					this.valid = true
					this.message = 'Channel: '
					this.channel = result
				}else{
					this.valid = false
					this.message = 'No channel found'
				}
			} catch (error) {
				this.valid = false
				this.message = error
			}
		},
		submit() {
			console.log(channel)
		}
	}
}
</script>

<style scoped>
	form {
		margin-top: 5rem;
		text-align: center;
	}
	label {
		color: var(--main-gray-color);
		margin-bottom: 0.5rem;
		font-size: 0.7em;
		display: inline-block;
	}
	#info {
		color: var(--main-gray-color);
		margin-bottom: 0;
	}
	#channel_title {
		color: black;
		text-decoration-style: dotted;
	}
	#channel_title:hover {
		text-decoration-style: solid;
	}
</style>