<template>
	<router-link to="/" class="header_nav_link">Back</router-link>
	<section class="page">
		<h1>Sequence</h1>
	</section>
</template>

<script>
export default {
	data(){
		return {
			sceneList: [],
			thread: []
		}
	},
	props:['store'],
	mounted() {
		const _store = JSON.parse(this.store)
		this.sceneList = _store.sceneList
		_store.threadIds.forEach((item) => {
			const el = this.sceneList.find( e => e.h_id == item )
			if(el) this.thread.push(el)
		})
		console.log(this.thread)
	}
}
</script>