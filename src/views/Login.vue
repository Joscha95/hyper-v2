<script>
export default {
	props:['sceneId', 'email', 'password', 'slug'],
	data() {
		return {
			axios: require('axios').default,
		}
	},
	mounted() {
		this.axios.post(
			process.env.VUE_APP_API_URL + '?r=a',
			{ id: parseInt(this.sceneId), email: this.email, password: this.password },
			{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
		).then(response => {
			if(response.status === 200){
				this.$router.push('/'+this.slug)
			}
		}).catch(error => {
			this.$router.push('/')
		})
	}
}
</script>