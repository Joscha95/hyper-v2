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
		<toggle off="eye" on="move" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="toggleVal" v-model="toggleVal" :icon="true"/>
		
		<div id="icons">
			<!--<span class="icon arrows"></span>-->
			<span class="icon eye"></span>
			<span class="icon move"></span>
			<span class="icon connect"></span>
			<span class="icon lookout"></span>
			<span class="icon lookoutmove"></span>
			<span class="icon firstperson"></span>
			<span class="icon orbit"></span>
			<span class="icon link"></span>
			<!--<span class="icon arrow"></span>-->
			<span class="icon dynamic"></span>
			<span class="icon anchor"></span>
			<!--<span class="icon thread"></span>-->
			<span class="icon threadstart"></span>
			<span class="icon threaddelete"></span>
			<span class="icon threadprev"></span>
			<span class="icon threadnext"></span>
			<span class="icon trash"></span>
			<span class="icon trashopen"></span>
			<span class="icon refresh"></span>
		</div>

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

<style>
#icons {
	margin: 1em 0;
}
#icons span {
	margin-right: 1em;
}
</style>