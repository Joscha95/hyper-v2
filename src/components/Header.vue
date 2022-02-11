<template>
	<header>
		<div id="logo"  v-bind:class="{ dark: !channelName }">{{ appName }}</div>
		<div id="seperator" v-if="channelName">/</div>
		<div id="channel_name" v-if="channelName"></div>
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

<style scoped>
	header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
	}
	#logo, #seperator, #channel_name {
		display: inline;
		color: var(--main-gray-color);
		margin-right: .33em;
	}
	#channel_name, 	#logo.dark {
		color: var(--main-dark-color);
	}
</style>