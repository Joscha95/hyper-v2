<template>
	<div id="notification" @click="notification.id=false" :class="[{show:notification.id}, notification.type]" v-html="notification.text"></div>
</template>

<script>
export default {
	props: {
		notification: Object
	},
	data() {
		return {
			timer: null
		}
	},
	watch: {
		notification() {
			window.clearTimeout(this.timer)
			this.timer = setTimeout(() => { this.notification.id = false;  }, this.notification.timeout)
		}
	}
}
</script>

<style scoped>
	#notification {
		position: fixed;
		left: 50%;
		top: 0em;
		max-width: 50%;
		font-size: .9em;
		transform: translate(-50%, -100%);
		padding: 1em 1.3em;
		border-radius: 1.5em;
		transition: all .33s;
		box-shadow: none;
		box-sizing: content-box;
		cursor: pointer;
		z-index: var(--main-layer-three);
	}
	#notification.show {
		top: 1em;
		transform: translate(-50%, 0);
		box-shadow: 0 0 .5em rgba(0,0,0,.25);
	}
	.default {
		background: var(--main-faintgray-color);
		color: black;
	}
	.success {
		background: var(--main-success-color);
		color: white;
	}
	.error {
		background: var(--main-error-color);
		color: white;
	}
</style>