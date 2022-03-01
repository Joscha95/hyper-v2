<template>
	<Notification :notification="this.notification" />
	<PopupBox :popupBox="this.popupBox" />
	<Header :title="this.channelTitle" />
	<main >
		<router-view />
	</main>
</template>

<script>
	import Notification from '@/components/Notification.vue'
	import PopupBox from '@/components/PopupBox.vue'
	import Header from '@/components/Header.vue'
	import store from '@/store.js';

	export default {
		setup() {

		},
		data() {
			return {
				appName: 'hyper',
				channelTitle: false,
				notification: { id: false, text: '', type: '' },
				popupBox: { body: '', button: false },
				store,
			}
		},
		methods: {
			notify(text, type = 'default') {
				this.notification = { id: Date.now(), text: text, type: type }
			},
			popup(body, button = false) {
				this.popupBox = { body: body, button: button }
			}
		},
		components: { Notification, PopupBox, Header }
	}
</script>