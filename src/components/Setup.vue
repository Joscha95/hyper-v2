<template>
	<form @submit.prevent="submit">
		<label>Input the URL of an existing <a href="https://www.are.na/" target="_blank">Are.na</a> Channel:</label>
		<br>
		<input type="text" v-model.trim="input" >
		<br>
		<p id="info">
			<span id="message">{{ message }}</span>
			<a 
				v-if="valid"
				:href="'https://www.are.na/channel/'+channel.id" 
				id="channel_title" 
				target="_blank"
			>
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
			console.log(this.channel)
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
		margin-bottom: 0.5rem;
		font-size: 0.7em;
		display: inline-block;
	}
	label a {
		color: inherit;
		text-decoration-style: dotted;
	}
	input {
		border: 1px solid black;
		height: 2.3rem;
		border-radius: 1px;
		font-size: 1rem;
		padding: 0 0.6em;
		background-color: var(--main-faintgray-color);
		width: 15rem;
		display: inline-block;
	}
	button {
		display: inline-block;
		background: white;
		border: 0;
		height: 2.7rem;
		border-radius: 8px;
		padding: 0 3em;
		font-weight: bold;
		font-size: 1em;
		margin-top: 2rem;
		cursor: pointer;
		border: 1px solid var(--main-gray-color);
		color: var(--main-darkgray-color);
	}
	button:hover, button:hover {
		border: 1px solid black;
		color: black;
	}
	button:disabled, button[disabled], button:disabled:hover, button[disabled]:hover{
		color: var(--main-gray-color);
		cursor: auto;
		border: 1px solid var(--main-lightgray-color);
		background-color: var(--main-faintgray-color);
	}
	#info {
		margin-bottom: 0;
	}
	#channel_title {
		color: black;
		text-decoration-style: dotted;
	}
	#channel_title:hover, label a:hover {
		text-decoration-style: solid;
	}
</style>