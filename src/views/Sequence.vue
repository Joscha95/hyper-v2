<template>
	<router-link to="/" class="header_nav_link">Back</router-link>
	<section class="page">
		<div class="toggle_wrapper">
			<toggle  off="&nbsp;Show Scene-list&ensp;" on="&nbsp;Show thread&ensp;" tooltipOff="" tooltipOn="" :bool="showThread" v-model="showThread" :icon="false"/>
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
		<h3 v-if="!hasContent">No Data. Please go back to your hyperchannel and click the Sequence button.</h3>
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
		margin: 1em 0;
	}
	.toggle_wrapper{
		text-align:center;
	}

	h3{
		line-height:1.5;
	}

</style>


<!-- const _store = JSON.parse('{"selectedObject":null,"scene":null,"isDragging":false,"sceneList":[{"h_id":"H1647097578433t3ukY","name":"tennis.jpg","content":"","description":"","isFixed":false,"h_type":"content","a_id":456469,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0NTY0Njkvb3JpZ2luYWxfMmViMGMzMDE4ZDU1ZjNkOTEyZWJjNDA4NzFlYmI0NTUuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo0MDAsImhlaWdodCI6NDAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=1"},{"h_id":"H1647097590564dN9IJ","name":"","content":"These two take selfies :-)","isFixed":false,"h_type":"connection","sourceID":"H1647097578433t3ukY","targetID":"H1647097588102dh4Vu","initDistance":313.0991786535309,"from":"H1647107942541NWiOp","to":"H1647098831995Ylxzv"},{"h_id":"H1647098831995Ylxzv","name":"","content":"asda *sddd*","isFixed":true,"h_type":"lookout","from":"H1647097590564dN9IJ"},{"h_id":"H1647097588102dh4Vu","name":"photo-op-by-kennardphillipps-at-catalyst:-contemporary-art-and-war-exhibition-at-iwm-north-photograph:-kennardphillipps-reut...","content":"","description":"","isFixed":false,"h_type":"content","a_id":4316287,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0MzE2Mjg3L29yaWdpbmFsXzQ0NDgwMjlmY2VlZTViODBlN2QzMWZiMDNlNWVlOWNlLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NDAwLCJoZWlnaHQiOjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo5MH0sImpwZWciOnsicXVhbGl0eSI6OTB9LCJyb3RhdGUiOm51bGx9fQ==?bc=1","to":"H16471079451369x3Ub"},{"h_id":"H1647107935080WzFPH","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107935559incdo","name":"screenshot-2021-01-06-at-22.28.52.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368715,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNS9vcmlnaW5hbF9iYTJhNGQ0Njc0NmRkMWZmZDJlYmU2ODUzZjAxMmQxZS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107942541NWiOp","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H1647107935559incdo","targetID":"H1647107936029z2suj","initDistance":156.85533860673883,"from":"H16471079451369x3Ub","to":"H1647097590564dN9IJ"},{"h_id":"H1647107936029z2suj","name":"screenshot-2021-01-06-at-22.28.52.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368715,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNS9vcmlnaW5hbF9iYTJhNGQ0Njc0NmRkMWZmZDJlYmU2ODUzZjAxMmQxZS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107944700ZBPzf","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H1647107936029z2suj","targetID":"H1647107939036hj2C9","initDistance":136.81834134953735},{"h_id":"H1647107936543rhGy9","name":"screenshot-2021-01-06-at-22.28.52.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368715,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNS9vcmlnaW5hbF9iYTJhNGQ0Njc0NmRkMWZmZDJlYmU2ODUzZjAxMmQxZS5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H16471079373925WqGV","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H16471080493044DVqv","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H16471079373925WqGV","targetID":"H1647107935080WzFPH","initDistance":196.54227972486512},{"h_id":"H1647107940751lMENH","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H16471079373925WqGV","targetID":"H1647107936029z2suj","initDistance":139.73514150172133},{"h_id":"H16471079378190lfCW","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107938473cLLdz","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107938754JSmhy","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107939036hj2C9","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H16471079489664xpBG","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H1647107939036hj2C9","targetID":"H1647107946208acAAU","initDistance":130.98092342624548},{"h_id":"H16471079451369x3Ub","name":"DNHCloDW0AA3Vcc.jpg","content":"","description":"","isFixed":false,"h_type":"content","a_id":1373130,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMzczMTMwL29yaWdpbmFsX2I3ZTQzMDNjMzQ5YmM1OWY4MmFmODgyZDMxZWQ0NzY4LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NDAwLCJoZWlnaHQiOjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo5MH0sImpwZWciOnsicXVhbGl0eSI6OTB9LCJyb3RhdGUiOm51bGx9fQ==?bc=1","from":"H1647097588102dh4Vu","to":"H1647107942541NWiOp"},{"h_id":"H1647107945521OYg7M","name":"large_4c6cb9a6aa57c12966cf87dbec4e353b.jpeg","content":"","description":"","isFixed":false,"h_type":"content","a_id":9516440,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI5NTE2NDQwL29yaWdpbmFsXzZkZjQyNDM0N2YxNDBiOTAxNWQ1NzYyYjI3ZjJjM2NkLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NDAwLCJoZWlnaHQiOjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo5MH0sImpwZWciOnsicXVhbGl0eSI6OTB9LCJyb3RhdGUiOm51bGx9fQ==?bc=0"},{"h_id":"H16471079458540WH6C","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107946208acAAU","name":"www.google.com_maps_@39.021805-93.5946076-165m_data=-3m1-1e3.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":14432509,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxNDQzMjUwOS9vcmlnaW5hbF9kODhmY2Y4NDhjZjBiNTM0MGZlZTBmMDQxZGVkODRhNC5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107946537yKmhn","name":"www.google.com_maps_@39.021805-93.5946076-165m_data=-3m1-1e3.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":14432509,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxNDQzMjUwOS9vcmlnaW5hbF9kODhmY2Y4NDhjZjBiNTM0MGZlZTBmMDQxZGVkODRhNC5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107950900frkP9","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H1647107946537yKmhn","targetID":"H1647107939036hj2C9","initDistance":128.39749855763677},{"h_id":"H1647107947144evq0W","name":"screenshot-2021-01-06-at-22.33.35.png","content":"","description":"","isFixed":false,"h_type":"content","a_id":10368716,"class":"Image","imageUrl":"https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiIxMDM2ODcxNi9vcmlnaW5hbF9kZjAwYzNjMTAyNjFkNjU3N2M4ZjZhNjRlODQ0MGU2Yy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMCwiaGVpZ2h0Ijo0MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6OTB9LCJqcGVnIjp7InF1YWxpdHkiOjkwfSwicm90YXRlIjpudWxsfX0=?bc=0"},{"h_id":"H1647107952890ca3Jo","name":"","content":"","isFixed":false,"h_type":"connection","sourceID":"H1647107947144evq0W","targetID":"H1647107936029z2suj","initDistance":223.76086592153183}],"threadIds":["H1647097588102dh4Vu","H16471079451369x3Ub","H1647107942541NWiOp","H1647097590564dN9IJ","H1647098831995Ylxzv"],"focused":false,"connectionCount":0,"unsavedChanges":0,"isOrbit":false,"loggedIn":true,"isTouch":false,"colors":{"connection":"#4a4aba","thread":"#f85330","lookout":"black"},"sceneSettings":{"showCircles":false,"backgroundColor":{"top":"#c8c8c8","bottom":"#f0f0f0"}},"sceneSettingsDefault":{"showCircles":true,"backgroundColor":{"bottom":"#f0f0f0","top":"#c8c8c8"}}}') -->