<template>
	<div class="popup" v-if="show">
		<div class="popup_body" v-html="popupBox.body"></div>
		<div class="popup_close_button" @click="show=false">{{ popupBox.button ? popupBox.button : 'close' }}</div>
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