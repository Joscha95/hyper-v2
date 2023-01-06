<template>
	<a @click="$router.go(-1)" class="header_nav_link non_href_link">Back to hyperchannel</a>
	<section class="page">
		<div class="toggle_wrapper">
			<toggle  off="&nbsp;Show Scene-list&nbsp;&nbsp;" on="&nbsp;&nbsp;&nbsp;&nbsp;Show thread&nbsp;&nbsp;&nbsp;&nbsp;" tooltipOff="" tooltipOn="" :bool="showThread" v-model="showThread" :icon="false"/>
		</div>

		<h1>Sequence</h1>
		<div class="block" v-for="block in activeList">
			<div v-if="block.h_type=='content'">
				<img v-if="block.imageUrl!=''" :src="block.imageUrl" alt="">
				<span v-if="block.description!=''" v-html="block.description"></span>
			</div>
			<div v-else-if="block.h_type=='lookout'">
				<h2 v-if="block.name">{{ block.name }}</h2>
				<p v-if="block.content" v-html="markdown(block.content)" ></p>
				<div v-if="!block.content && !block.name" class="icon lookout"></div>
			</div>
			<div v-else-if="block.h_type=='connection'">
				<p v-if="block.content" v-html="markdown(block.content)" ></p>
				<div v-else class="icon connection"></div>
			</div>
		</div>
		<span v-if="!hasContent">No Data. Please go back to your hyperchannel and click the Sequence button.</span>
	</section>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import toggle from '@/components/stage/subcomponents/toggle.vue'

export default {
	data(){
		return {
			sceneList: [],
			thread: [],
			showThread:true,
			hasContent:true
		}
	},
	methods:{
		markdown(string){
			return marked.parse(DOMPurify.sanitize(string, { USE_PROFILES: { html: true } }))
		}
	},
	props:['store'],
	components:{toggle},
	mounted() {
		if(!this.store) {
			this.hasContent=false;
			return;
		}
		const _store = JSON.parse(this.store)
		this.sceneList = _store.sceneList
		_store.threadIds.forEach((item) => {
			const el = this.sceneList.find( e => e.h_id == item )
			if(el) this.thread.push(el)
		})
	},
	computed:{
		activeList(){
			return this.showThread ? this.thread : this.sceneList;
		}
	}
}
</script>

<style scoped>
	.block{
		margin: 3rem 0;
		text-align: center;
	}
	.toggle_wrapper{
		text-align:center;
	}

	h3{
		line-height:1.5;
	}

</style>