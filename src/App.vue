<template>
	<Notification :notification="this.notification" />
	<Popup :popup="this.popup" />
	<Header :title="this.channelTitle" />
	<main >
		<router-view />
	</main>
</template>

<script>
	import Notification from '@/components/Notification.vue'
	import Popup from '@/components/Popup.vue'
	import Header from '@/components/Header.vue'
	
	export default {
		setup() {
			
		},
		data() {
			return {
				appName: 'hyper',
				channelTitle: false,
				notification: { id: false, text: '', type: '' },
				popup: { body: '', headline: '' }
			}
		},
		methods: {
			notify(text, type = 'default') {
				this.notification = { id: Date.now(), text: text, type: type }
			},
			say(body, headline = false) {
				this.popup = { body: body, headline: headline }
			}
		},
		components: { Notification, Popup, Header }
	}
</script>