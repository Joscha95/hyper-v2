<template>
	<header>
		<div id="logo">
			(
				<span id="channel_name" :class="{opened:this.$root.showSource}" @click="this.$root.showSource=!this.$root.showSource" v-if="this.$route.name=='Stage'">{{ title }}</span>
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
		z-index: var(--main-layer-two);
	}
	#logo {
		display: inline;
		color: var(--main-mediumgray-color);
	}
	#channel_name {
		color: black;
		cursor: pointer;
	}
	#channel_name:hover:after, #channel_name.opened:after {
		content: '▼';
		font-size: .5em;
		margin-left: .5em;
		vertical-align: text-top;
	}
	#channel_name.opened:after {
		content: '▲';
	}
	.header_nav_link {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>