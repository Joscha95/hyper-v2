<template>
	<div id="popup" class="show">
		<h4 id="headline" v-if="popup.headline">{{ popup.headline }}</h4>
		<div id="body">Eine super lange ganz ganz lange überschrift</div>
		<div id="close_button_wrapper"><span id="close_button">close</span></div>
	</div>
</template>

<script>
export default {
	props: {
		popup: Object
	}
}
</script>

<style scoped>
	#popup {
		background: white;
		border: 3px solid var(--main-lightgray-color);
		position: fixed;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 24rem;
		box-sizing: border-box;
		padding: 1.8em 2em 1em 2em;
		z-index: var(--main-layer-overkill);
		max-width: 80%;
		border-radius: .4rem;
		display: none;
	}
	#headline {
		margin: 0;
		margin-bottom: 1.2em;
		color: var(--main-gray-color);
	}
	#body {
		margin-bottom: 1.5em;
		color: black;
	}
	#close_button_wrapper {
		text-align: center;
		color: var(--main-gray-color);
		font-weight: bold;
	}
	#close_button:hover {
		color: black;
		cursor: pointer;
	}
</style>