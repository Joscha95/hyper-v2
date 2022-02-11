<template>
	<form @submit.prevent="submit">
		<label for="chName_input">Input the name or URL of an Are.na Channel:</label>
		<br>
		<input id="chName_input" type="text" v-model="rawInput" @keyup="test">
		<br>
		<p id="info">Channel: {{ rawInput }}</p>
		<button type="submit">Create hyper</button>
	</form>
</template>

<script>
export default {
	data() {
		return {
			rawInput: ''
		}
	}, 
	methods: {
		test() {
			console.log(this.rawInput);
		},
		submit() {
			//this.channelRef
			console.log('submitted');
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
	input {
		border: 1px solid black;
		height: 2rem;
		border-radius: 2px;
		font-size: 1rem;
		padding: 0 0.4em;
		background-color: var(--main-faintgray-color);
		width: 15rem;
		display: inline-block;
	}
	#info {
		margin-bottom: 2rem;
	}
	button {
		display: inline-block;
		background: var(--main-lightgray-color);
		border: 0;
		height: 2.5rem;
		border-radius: 5px;
		padding: 0 3em;
		font-weight: bold;
		color: var(--main-gray-color);
		font-size: 0.85rem;
	}
	
</style>