<template>
	<div id="logo">
		(
			<span v-if="title" id="header_title">{{ title }}</span>
		)
		<router-link id="app_name" to="/about">{{ this.$root.appName }}</router-link>
	</div>
</template>

<script>
export default {
  props: {
	title: String
  }
}
</script>