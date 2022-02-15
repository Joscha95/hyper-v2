<template>
	<header>
		<div id="logo">
			(
				<span id="channel_name" v-if="this.$root.channelName">{{ this.$root.channelName }}</span>
			)
			<sup id="app_name">{{ this.$root.appName }}</sup>
		</div>
	</header>
</template>

<script>
export default {
	props: {
		appName: String,
		channelName: String
	}
}
</script>

<style>
	header {
		top: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
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