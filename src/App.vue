<template>
	<Header appName="hyper" />
	<Setup />
</template>

<script>
import Header from './components/Header.vue'
import Setup from './components/Setup.vue'

export default {
	name: 'App',
	components: { Header, Setup }
}
</script>

<style>
	@import './assets/css/main.css';
</style>
