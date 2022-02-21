<template>
	<Notification :notification="this.notification" />
	<Header :title="this.channelTitle" />
	<main >
		<router-view />
	</main>
</template>

<script>
	import Notification from '@/components/Notification.vue'
	import Header from '@/components/Header.vue'
	
	export default {
		setup() {
			
		},
		data() {
			return {
				appName: 'hyper',
				channelTitle: false,
				notification: { id: false, text: '', type: '' }
			}
		},
		methods: {
			notify(text, type = 'default') {
				this.notification = { id: Date.now(), text: text, type: type }
			}
		},
		components: { Notification, Header }
	}
</script>