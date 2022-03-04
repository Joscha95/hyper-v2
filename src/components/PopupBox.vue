<template>
	<div id="popup" v-if="show">
		<div id="body" v-html="popupBox.body"></div>
		<div id="close_button_wrapper">
			<span id="close_button" @click="show=false">{{ popupBox.button ? popupBox.button : 'close' }}</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		popupBox: Object
	},
	data() {
		return {
			show: false
		}
	},
	watch: {
		popupBox() {
			this.show = true
		}
	}
}
</script>

<style scoped>
	#popup {
		background: white;
		box-shadow: 0 0 0 4px rgba(0,0,0,.1);
		position: fixed;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 24rem;
		box-sizing: border-box;
		padding: 1.8em 2em 1em 2em;
		z-index: 1000;
		max-width: 80%;
		border-radius: .5rem;
		font-size: .9em;
		line-height: 1.5em;
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
		color: var(--main-mediumgray-color);
		font-weight: bold;
	}
	#close_button:hover {
		color: black;
		cursor: pointer;
	}
</style>