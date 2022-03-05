<template>
	<div class="popup">
		<div class="popup_body">
			
			<input type="password" v-model.trim="password">
			<button @click="recover">recover</button>
			
		</div>
		<div class="popup_close_button">close</div>
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