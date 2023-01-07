<template>
	
	<router-link to="/" class="single_header_nav_link">Create your hyperchannel</router-link>
	
	<section class="page">
		
		<h1>ABOUT</h1>
		
		<p>
			Hyperchannel is an (experimental) graphing tool to assemble and connect data in virtual space.
			It makes use of the <a href="https://are.na" target="_blank">Are.na</a> API and lets users create 
			a three-dimensional tapestry of their Are.na blocks.
		</p>
		
		<p>
			3D space is rendered via <a href="https://threejs.org" target="_blank">three.JS</a> and uses a
			<a href="https://observablehq.com/@d3/force-directed-graph" target="_blank">D3 Force-Directed Graph</a> layout,
			together with the <a href="https://github.com/vasturiano/3d-force-graph" target="_blank">3d-force-graph</a> code by Vasco Asturiano.
			UI build with <a href="https://vuejs.org" target="_blank">Vue</a>. 
		</p>
		
		<p>Created by <a href="https://joschabruening.eu/" target="_blank">Joscha Brüning</a> and <a href="https://leuys.com" target="_blank">Benjamin Unterluggauer</a> in early 2022.</p>
		
		<p><small>(Last Updated 01.2023) v 0.25</small></p>
		
		<IntroVideo />
		
	</section>

</template>

<script>
import IntroVideo from '@/components/setup/IntroVideo.vue'
	
export default {
	components: { IntroVideo },
}
</script>