<template lang="html">
  
  
  <CanvasDragtarget @blockAdded="blockAdded"/>


  <div oncontextmenu="return false;" id="scene" ref="scene"></div>


  <div id="toolbox_wrapper"></div>


    <div id="node_info" :class="currentelementInCameraView?'show':''" v-if="lastValidChainElement">
      <a v-if="lastValidChainElement.from" :href="'#'+lastValidChainElement.from.h_id" id="weave_from_btn">◀</a> <!-- {{ lastValidChainElement.from.name }} -->
      <div id="node_info_text">
        <div class="bold" v-if="lastValidChainElement.name!=''">{{ lastValidChainElement.name }}</div>
        <div class="description this" v-if="lastValidChainElement.description!=''" v-html="lastValidChainElement.description"></div>
        <div class="description" v-if="lastValidChainElement.content!='' && lastValidChainElement.h_type=='lookout'"><pre>{{ lastValidChainElement.content }}</pre></div>
      </div>
      <a v-if="lastValidChainElement.to" :href="'#'+lastValidChainElement.to.h_id" id="weave_to_btn">▶</a> <!-- {{ lastValidChainElement.to.name }} -->
    </div>


  <div id="camera_controls" :class="{margin_right:showEditor}">
	  <div v-if="loggedIn" id="lookout_btn" :class="{transform:isInLookout}"  v-on="isInLookout ? { click: toggleLookoutSync } : { click: addLookout }" >
      <span v-if="isInLookout">{{THREEScene.cameraController.lookoutSync ? 'End transform' : 'Transform'}}</span>
      <span v-else>Add</span>
		  <span class="icon lookout"></span>
	  </div>
    <toggle id="camera_toggle" off="firstperson" on="orbit" tooltipOff="First person camera" tooltipOn="Orbit camera" :bool="store.isOrbit" v-model="store.isOrbit" :icon="true"/>
	</div>


</template>

<script>
import ForceSimulation from '@/modules/3dForceSimulation.js';
import THREEScene from '@/modules/THREEScene.js';
import {makeid} from '@/modules/Helpers.js';
import CanvasDragtarget from '@/components/stage/CanvasDragtarget.vue';
import { nextTick } from 'vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'

export default {
  data(){
    return{
      graphData:{
          "nodes": this.$root.store.sceneList,
          "links": this.$root.store.sceneList.filter((n) => n.h_type=='connection').map((n) => n.links).flat()
      },
      THREEScene:null,
      forceSimulation:null,
      store:this.$root.store,
      lastValidChainElement:undefined
    }
  },
  props:['showEditor','loggedIn'],
  mounted(){
    const cameraSettings = {
    	zoomSpeed: 50,
    	moveSpeed: 5,
    	rotateSpeed: 0.15
    }

    this.forceSimulation=new ForceSimulation(this.graphData);
    this.THREEScene = new THREEScene(this.$refs.scene,this.forceSimulation,cameraSettings,this.store);
    this.THREEScene.onLinkAdded = (l) => {this.linkAdded(l)};
  },
  components:{
    CanvasDragtarget,toggle
  },
  computed:{
    linkDistance(){
      return this.graphData.links.reduce((oldVal,item) => oldVal+item.distance,0);
    },
    isFocused(){
      return this.store.focused
    },
    currentItem(){
        return this.store.selectedObject
    },
    currentelementInCameraView(){
      return this.store.elementInCameraView ? this.store.sceneList.find((n)=>n.h_id==this.store.elementInCameraView ) : undefined;
    },
    nodesLength(){
      return this.graphData.nodes.length
    },
    threadLength(){
      return this.store.thread.length
    },
    sceneList(){
      return this.$root.store.sceneList
    },
    isOrbit(){
      return this.store.isOrbit
    },
    isInLookout(){
      return this.lastValidChainElement && this.lastValidChainElement.h_type=='lookout' && this.lastValidChainElement.active
    }
  },
  watch:{
    linkDistance(){
        this.forceSimulation.updateLinkDistances();
      },
    isFocused(){
      this.THREEScene.cameraController.enabled=!this.store.focused;
    },
    currentItem(newVal){
      if(!newVal) return;
      this.THREEScene.focusItem(this.store.selectedObject.h_id,this.store.selectedObject.h_type)
    },
    currentelementInCameraView(newVal){
      if (newVal) this.lastValidChainElement=newVal
    },
    nodesLength(){
      this.graphData.links=this.graphData.nodes.filter((n) => n.h_type=='connection').map((n) => n.links).flat()
      this.forceSimulation.updateGraph()
      this.store.unsavedChanges++;
    },
    threadLength(newVal){
      this.store.unsavedChanges++;
      this.THREEScene.blocks.forEach((item)=>item.canStartThread=newVal==0)
    },
    isOrbit(val){
      this.THREEScene.toggleCamMode();
      const mode = val ? '<span class="icon orbit"></span>&ensp;Orbit' : '<span class="icon firstperson"></span>&ensp;First person'
      this.$root.notify('Camera is now:&ensp;'+mode, 'default',2000)
    }
  },
  methods:{
    blockAdded(b){
      const pos = this.THREEScene.getWorldPosition(b.clientX,b.clientY)
      const ele = b.element;
      ele.x=pos.x
      ele.y=pos.y
      ele.z=pos.z
      ele.val=1
    },
    linkAdded(l){
      this.graphData.nodes.splice(this.graphData.nodes.findIndex((n)=> n.h_id == l.link1.source)+1,0,l.node)
      //this.graphData.nodes.push(l.node)
    },
    updateContents(allBlocks){
      let a_block;
      this.graphData.nodes.forEach((item)=>{
        if(item.h_type=='connection') return;
        a_block = allBlocks.find((b) => b.id == item.a_id);
        if(!a_block) return;
        item.name= a_block.title
        item.content = a_block.content_html
        item.imageUrl = a_block.image ? a_block.image.thumb.url : '',
        item.sceneElement.updateDisplayElement();
      })
    },
    toggleLookoutSync(){
      this.THREEScene.cameraController.toggleLookoutSync();
      this.forceSimulation.reheat(.1);
    },
    addLookout(){
      const rot = this.THREEScene.cameraController.rotation();
      const pos = this.THREEScene.cameraController.position();
      const node = {
        h_id: makeid(5),
        name:'',
        to:[],
        from:[],
        isFixed:true,
        content:'',
        h_type: 'lookout',
        rx:rot.x,
        ry:rot.y,
        rz:rot.z,
        fx:pos.x,
        fy:pos.y,
        fz:pos.z,
        x:pos.x,
        y:pos.y,
        z:pos.z
      }

      this.store.sceneList.push(node);
      window.location.hash=node.h_id;
    },
    init(){
      this.graphData.nodes=this.$root.store.sceneList;
      this.graphData.links=this.graphData.nodes.filter((n) => n.h_type=='connection').map((n) => n.links).flat()
      this.forceSimulation.updateGraph();
      this.THREEScene.thread.setup(this.THREEScene.blocks);
      nextTick(() => {
        this.store.unsavedChanges=0;
      })
    }
  }
}
</script>

<style scoped>

#scene{
  position:fixed;
  top:0;
  left:0;
  z-index:-1;
}

#toolbox_wrapper{
  position:fixed;
  z-index:1;
  user-select:none;
}

#node_info {
  background-color: white;
  border-radius: 5px;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  z-index: var(--main-layer-three);
  margin: 0;
  width: auto;
  left: 50%;
  transform: translate(-50%, 110%);
  transition:transform .4s ease;
  box-shadow: 0 0 0 3px rgba(0,0,0,.1), 0 0 1em rgba(0,0,0,.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}
#node_info.show{
  transform: translate(-50%, 0);
  bottom: 1rem;
  box-shadow: 0;
}
#node_info_text {
  flex-grow: 2;
  margin: 0 2rem;
}
.description{
  margin-top:.7em;
  font-size:.7em;
}
#weave_from_btn, #weave_to_btn {
  color: var(--main-thread-color);
  font-size: .9em;
}

a {
  text-decoration:none;
}

</style>