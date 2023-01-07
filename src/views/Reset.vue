<template>
	<router-link to="/" class="single_header_nav_link">Create new hyper</router-link>
	<section class="page">
		<form @submit.prevent="submit">
			<h1>Password reset</h1>
			<label><strong>Choose new password</strong><span id="pwLInd">{{ password.length }} > {{ passwordMinLength-1 }}</span></label>
			<input type="password" v-model.trim="password" :class="{ valid: isValid }" minlength="{{ passwordMinLength }}" maxlength="255" required>
			<button type="submit" :disabled="!isValid">reset password</button>
		</form>
	</section>
</template>


<script>
	export default {
		data() {
			return {
				axios: require('axios').default,
				password: '',
				passwordMinLength: 8,
			}
		},
		computed:{
			isValid(){ return this.password.length > (this.passwordMinLength-1) }
		},
		methods: {
			submit() {
				this.axios.post(
					process.env.VUE_APP_API_URL + '?r=pw',
					{ id: this.sceneId, auth: this.$route.params.auth, password: this.password }, 
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
		}
	}
</script>

<style scoped>
	h1 {
		margin-bottom: 1.5em;
	}
	form {
		margin: 5rem auto 0 auto;
		text-align: center;
		width: 18rem;
	}
	input, label {
		width: 100%;
		display: block;
		text-align: left;
	}
	button[type="submit"]{
		margin-top: 2rem;
	}
	#pwLInd {
		float: right;
	}
</style>