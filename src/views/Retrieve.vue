<template>
	
	<router-link to="/" class="single_header_nav_link">Create new hyperchannel</router-link>
	
	<form @submit.prevent="submit">
		<h3>Retrieve your hyperchannel</h3>
		<section id="hyperchannel_search">
			<label>In case you forgot the link to your hyperchannel, you can retrieve it by the specified mail address</label>
			<input type="email" v-model.trim="email" placeholder="your mail address" :class="{ valid: validEmail }" maxlength="255" required>
		</section>
		<button type="submit" :disabled="!validEmail">Search</button>
	</form>
	
	<div id="search_resutls">
		<table v-if="foundScenes && !nothingFound">
			<thead>
				<tr>
					<th>Hyperchannel for</th>
					<th>Last Updated on</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(scene,i) in foundScenes" :key="i">
					<td>
						<a :href="'https://www.are.na/channel/'+scene.channel_id" target="_blank">
							https://www.are.na/channel/{{ scene.channel_id }}
						</a>
					</td> 
					<td>{{ scene.updated_on }}</td>
					<td>
						<router-link :to="'/'+scene.current_slug+'_'+scene.current_slug_number">Open</router-link>
					</td>
				</tr>
			</tbody>
		</table>
		<p id="nothing_found_msg" v-if="nothingFound">No hyperchannels found.</p>
	</div>
	
</template>


<script>
	
export default {

	data() {
		return {
			email: '',
			validEmail: false,
			axios: require('axios').default,
			foundScenes: false,
			nothingFound: false
		}
	},
	watch: {
		email() { 
			( this.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? this.validEmail=true : this.validEmail=false ) 
		},
		foundScenes() {
			console.log(this.foundScenes);
		}
	},
	methods: {
		submit() {
			if(this.validEmail) {
				
				this.axios.post(
					process.env.VUE_APP_API_URL + '?r=re',
					{ email: this.email },
					{ headers: {'Content-Type':'application/x-www-form-urlencoded'} }
				).then(response => {
					if(response.status === 200){
						this.nothingFound = false;
						this.foundScenes = response.data;
					}else if(response.status === 204){
						this.nothingFound = true;
					}
				}).catch(error => {
					this.$router.push('/')
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
	input:not(.valid, :focus) {
		background-color: var(--main-faintgray-color);
		color: black;
	}
	input.valid {
		background-color: white;
	}
	#nothing_found_msg {
		text-align: center;
		font-weight: bold;
	}
	table, #nothing_found_msg {
		font-size: .7em;
		margin: 3rem auto 10rem auto;
	}
	table {
		border-spacing: 0;
		border-bottom: 1px solid var(--main-lightgray-color);
	}
	th {
		text-align: left;
	}
	td, th {
		padding: .65em;
	}
	td {
		border-top: 1px solid var(--main-lightgray-color);
	}
</style>