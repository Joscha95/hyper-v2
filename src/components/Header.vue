<template>
	<header>
		<div id="logo">
			(
				<span id="channel_name" :class="{opened:this.$root.store.showSource}" @click="this.$root.store.showSource=!this.$root.store.showSource" v-if="this.$route.name=='Stage'">{{ $root.store.channelTitle }}</span>
			)
			<sup id="app_name"><router-link to="/about">{{ this.$root.appName }}</router-link></sup>
		</div>
	</header>
</template>

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
	#app_name a {
		text-decoration: none;
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