<template>
	<Notification :notification="this.notification"/>
	<PopupBox :popupBox="this.popupBox"/>
	<Header v-if="$route.name!='Stage'"/>
	<main :class="$route.name">
		<router-view/>
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
				notification: {},
				popupBox: {},
				store,
			}
		},
		setup() {
			let style = document.createElement('style')
			for (const [key, value] of Object.entries(store.colors)) {
				style.innerHTML = style.innerHTML+':root{--main-'+key+'-color: '+value+';}'
			}
			document.head.appendChild(style)
		},
		methods: {
			notify(text, type = 'default', timeout = 4000 ) {
				this.notification = { id: Date.now(), text: text, type: type, timeout: timeout }
			},
			popup(body, button = false) {
				this.popupBox = { body: body, button: button }
			},
		},
		components: { Notification, PopupBox, Header }
	}
</script>