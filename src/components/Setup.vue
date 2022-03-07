<template>
	<form @submit.prevent="submit">
		<h3>Create a hyperchannel</h3>
		<section id="channel_search">
			<label>Input the URL of an <a href="https://www.are.na/" target="_blank">Are.na</a> Channel:</label>
			<input type="text" v-model.trim="query" :class="{ valid: channel }" required>
			<p id="info" v-if="message">
				<span id="message">{{ message }}</span>
				<a v-if="channel" :href="`https://www.are.na/channel/${channel.id}`" id="channel_title" target="_blank">
					{{ channel.title }}
				</a>
			</p>
		</section>
		<section id="user_data" v-if="advance">
			<label><strong>Mail</strong></label>
			<input type="email" v-model.trim="email" :class="{ valid: validEmail }" maxlength="255" required><br>
			<label><strong>Choose a password</strong><span id="pwLInd">{{ password.length }} > {{ passwordMinLength-1 }}</span></label>
			<input type="password" v-model.trim="password" :class="{ valid: password.length>passwordMinLength-1 }" minlength="{{ passwordMinLength }}" maxlength="255" required>
		</section>
		<button type="submit" :disabled="!channel" v-if="!advance">Next</button>
		<button type="submit" :disabled="!valid" v-if="advance">Create hyper</button>
	</form>
</template>

<script>
export default {
	data() {
		return {
			query: '',
			message: '',
			channel: false,
			advance: false,
			valid: false,
			email: '',
			validEmail: false,
			password: '',
			passwordMinLength: 8
		}
	},
	watch: {
		query() {
			var slug = this.query
			var slashPos = this.query.lastIndexOf('/')
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
				this.channel = false
				this.message = ''
			}
		},
		email() { 
			( this.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? this.validEmail=true : this.validEmail=false ) 
			this.validate() 
		},
		password() { 
			this.validate() 
		}
	},
	methods: {
		async searchChannel(slug) {
			this.message = 'searching...'
			try {
				const res = await fetch(`https://api.are.na/v2/channels/${slug}?per=0`)
				const result = (await res.json())
				if(result.id){
					this.message = 'Channel: '
					this.channel = result
				}else{
					this.channel = false
					this.message = 'No channel found'
				}
			} catch (error) {
				this.channel = false
				this.message = error
			}
			this.validate()
		},
		validate() {
			(
				!this.validEmail || 
				this.password.length < this.passwordMinLength ||
				this.channel == false ?
				this.valid = false :
				this.valid = true
			)
		},
		submit() {
			if(!this.advance && this.channel) {
				// proceed to next step
				this.advance = true
			} else {
				// finish, proceed to comp creation
				const axios = require('axios').default;
				axios.post(
					process.env.VUE_APP_API_URL + '?r=c',
					{ email: this.email, password: this.password, channel: this.channel }, 
					{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
				)
				.then(response => { 
					if(response.status === 200){
						this.$root.notify('Your hyperspace has been created', 'success')
						this.$router.push(`/${response.data.slug}`)
					}else{
						this.$root.notify('Something went wrong', 'error')
						console.error(response.data)
					}
				})
				.catch(error => { 
					// something went wrong creating the scene
					this.$root.notify(error, 'error')
					console.error(error)
				})
			}
		}
	}
}
</script>

<style scoped>
	form {
		margin: 7rem auto 0 auto;
		text-align: center;
		width: 18rem;
	}
	h3 {
		font-weight: normal;
		margin: 0 0 2em 0;
	}
	button {
		margin-top: 2.5em;
		height: 2.7em;
		padding: 0 3em;
	}
	input, label {
		width: 100%;
		display: block;
	}
	#user_data label {
		text-align: left;
	}
	input:not(.valid, :focus) {
		background-color: var(--main-faintgray-color);
		color: black;
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
	#user_data {
		margin-top: 2rem;
	}
	#pwLInd {
		float: right;
	}
</style>