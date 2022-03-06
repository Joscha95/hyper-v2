<template>
	<section class="page">
		<h1>H1 headline</h1>
		<h2>H2 headline</h2>
		<h3>H3 headline</h3>
		<h4>H4 headline</h4>
		<p>Paragraph Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</p>
		<p><a href="#">Link</a></p>
		<p><input placeholder="Input"></p>
		<p><button>Button</button></p>
		
		
		<toggle off="↔" on="⥿&nbsp;" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="toggleVal" v-model="toggleVal"/>
		

	</section>
</template>

<script>
import toggle from '@/components/stage/subcomponents/toggle.vue'

export default {
	components: {
		toggle
	},
	data() {
		return {
			toggleVal: false
		}
	}
}
</script>