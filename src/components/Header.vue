<template>
	<header>
		<div id="logo">
			(
				<span id="channel_name" v-if="this.$route.name=='Stage'">{{ title }}</span>
			)
			<sup id="app_name">{{ this.$root.appName }}</sup>
		</div>
	</header>
</template>

<script>
export default {
	props: {
		title: ''
	}
}
</script>

<style>
	header {
		position: fixed;
		top: 1rem;
		left: 1rem;
		box-sizing: border-box;
	}
	#logo {
		display: inline;
		color: var(--main-gray-color);
	}
	#channel_name {
		color: var(--main-darkgray-color);
	}
	.header_nav_link {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>