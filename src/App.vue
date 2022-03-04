<template>
	<Notification :notification="this.notification" />
	<PopupBox :popupBox="this.popupBox" />
	<Header :title="this.channelTitle" />
	<main :class="$route.name">
		<router-view />
	</main>
</template>

<script>
	import Notification from '@/components/Notification.vue'
	import PopupBox from '@/components/PopupBox.vue'
	import Header from '@/components/Header.vue'
	import store from '@/store.js';

	export default {
		data() {
			return {
				appName: 'hyper',
				channelTitle: false,
				showSource: false,
				notification: { id: false, text: '', type: '', timeout: 4000 },
				popupBox: { body: '', button: false },
				store,
			}
		},
		methods: {
			notify(text, type = 'default', timeout = 4000 ) {
				this.notification = { id: Date.now(), text: text, type: type, timeout: timeout }
			},
			popup(body, button = false) {
				this.popupBox = { body: body, button: button }
			}
		},
		components: { Notification, PopupBox, Header }
	}
</script>