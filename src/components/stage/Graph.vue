<template lang="html">


  <CanvasDragtarget @blockAdded="blockAdded"/>


  <div oncontextmenu="return false;" id="scene" ref="scene"></div>


  <div id="toolbox_wrapper"></div>


    <div id="node_info" :class="{show:showNodeInfo}" v-if="lastValidChainElement">
      <a v-if="lastValidChainElement.from" :href="'#'+lastValidChainElement.from" id="weave_from_btn" class="icon threadprev"></a> <!-- {{ lastValidChainElement.from.name }} -->
      <div id="node_info_text">
        <div class="bold" v-if="lastValidChainElement.name!=''">{{ lastValidChainElement.name }}</div>
        <div class="description this" v-if="lastValidChainElement.description && lastValidChainElement.description!=''" v-html="lastValidChainElement.description"></div>
        <div class="description" v-if="lastValidChainElement.content!='' && lastValidChainElement.h_type=='lookout'" v-html="markDownContent"></div>
        <div class="connection_properties" v-if="lastValidChainElement.h_type=='connection'">
    	  	<a :href="'#'+lastValidChainElement.sourceID" class="connection_property_circle" title="Connection source"></a>
          <span class="arrows">> ></span>
    	  	<a :href="'#'+lastValidChainElement.targetID" class="connection_property_circle" title="Connection target"></a>
    		</div>
      </div>
      <a v-if="lastValidChainElement.to" :href="'#'+lastValidChainElement.to" id="weave_to_btn" class="icon threadnext"></a> <!-- {{ lastValidChainElement.to.name }} -->
    </div>


  <div id="camera_controls" :class="{margin_right:showEditor}">
	  <div v-if="loggedIn" id="lookout_btn" :class="{transform:isInLookout}"  v-on="isInLookout ? { click: toggleLookoutSync } : { click: addLookout }" >
      <span v-if="isInLookout">{{ lookoutSyncActive ? 'Stop move' : 'Move'}}</span>
      <span v-else>Add</span>
		  <span class="icon lookout"></span>
	  </div>
    <toggle id="camera_toggle" off="firstperson" on="orbit" tooltipOff="First person camera" tooltipOn="Orbit camera" :bool="store.isOrbit" v-model="store.isOrbit" :icon="true"/>
	</div>


</template>

<script>
import THREEScene from '@/modules/THREEScene.js';
import {makeid} from '@/modules/Helpers.js';
import CanvasDragtarget from '@/components/stage/CanvasDragtarget.vue';
import { nextTick,shallowReactive } from 'vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'
import {forceSimulation,sceneElements} from '@/store.js'
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true
});

export default {

  data(){
    this.THREEScene = null
    this.store = this.$root.store
    return{
      lastValidChainElement:undefined,
      lookoutSyncActive:false
    }
  },
  props:['showEditor','loggedIn'],
  mounted(){
    const cameraSettings = {
    	zoomSpeed: 50,
    	moveSpeed: 5,
    	rotateSpeed: 0.15,
      isTouch:this.store.isTouch
    }

    this.THREEScene = new THREEScene(this.$refs.scene,forceSimulation,cameraSettings,this.store,sceneElements);
    this.THREEScene.onLinkAdded = (l) => {this.linkAdded(l)};
    forceSimulation.reheat()
  },
  components:{
    CanvasDragtarget,toggle
  },
  computed:{
    // linkDistance(){
    //   return this.graphData.links.reduce((oldVal,item) => oldVal+item.distance,0);
    // },
    isFocused(){
      return this.store.focused
    },
    currentItem(){
        return this.store.selectedObject
    },
    currentelementInCameraView(){
      return this.store.elementInCameraView ? this.store.sceneList.find((n)=>n.h_id==this.store.elementInCameraView ) : undefined;
    },
    threadLength(){
      return this.store.threadIds.length
    },
    nodesLength(){
      return this.$root.store.sceneList.length
    },
    isOrbit(){
      return this.store.isOrbit
    },
    isInLookout(){
      return this.lastValidChainElement && this.lastValidChainElement.h_type=='lookout' && this.lastValidChainElement.active
    },
    markDownContent(){
      return marked.parse(DOMPurify.sanitize(this.lastValidChainElement.content, { USE_PROFILES: { html: true } }))
    },
    showNodeInfo(){
      return this.currentelementInCameraView && (this.lastValidChainElement.h_type=='connection' || this.lastValidChainElement.name || this.lastValidChainElement.content || this.lastValidChainElement.from || this.lastValidChainElement.to || this.lastValidChainElement.description)
    },
    showPolarGrid(){
      return this.store.sceneSettings.showCircles
    },
    sceneBackground(){
      return this.store.sceneSettings.backgroundColor.bottom+this.store.sceneSettings.backgroundColor.top
    },
    isLoggedIn(){
      return this.store.loggedIn
    }
  },
  watch:{
    showPolarGrid(newVal){
      this.THREEScene.togglePolar(newVal);
    },
    sceneBackground(newVal){
      this.THREEScene.horizon.updateGradient(this.store.sceneSettings.backgroundColor);
    },
    isFocused(){
      this.THREEScene.cameraController.enabled=!this.store.focused;
    },
    isLoggedIn(){
      if(this.THREEScene.focusedItem) this.THREEScene.focusedItem.blur()
    },
    currentItem(newVal){
      if(!newVal) return;
      if (this.store.loggedIn) {
        this.THREEScene.focusItem(this.store.selectedObject.h_id,this.store.selectedObject.h_type)
      }else {
        window.location.hash=this.store.selectedObject.h_id;
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    },
    currentelementInCameraView(newVal){
      if (newVal) this.lastValidChainElement=newVal
    },
    threadLength(newVal){
      this.store.unsavedChanges++;
      this.THREEScene.blocks.forEach((item)=>item.canStartThread=newVal==0)
    },
    nodesLength(){
      forceSimulation.updateNodes(this.store.sceneList.map(e => e.h_id));
    },
    isInLookout(){
      this.lookoutSyncActive= this.THREEScene.cameraController.lookoutSync
    },
    isOrbit(val){
      this.THREEScene.toggleCamMode();
      const mode = val ? '<span class="icon orbit"></span>&ensp;Orbit' : '<span class="icon firstperson"></span>&ensp;First person'
      this.$root.notify('<span class="mediumgray">Camera is now:</span>&ensp;'+mode, 'default',2000)
    }
  },
  methods:{
    blockAdded(b){
      const pos = this.THREEScene.getWorldPosition(b.clientX,b.clientY)
      const nn = {
        h_id:b.element.h_id,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        val: 1
      }
      forceSimulation.addNode(nn);
      this.store.unsavedChanges++;
    },
    linkAdded(l){
      this.store.sceneList.splice(this.store.sceneList.findIndex((n)=> n.h_id == l.link1.source)+1,0,l.list_element);
      forceSimulation.addLink(l.simulation_element)
      this.store.unsavedChanges++;
    },
    updateContents(allBlocks){
      let a_block;
      this.THREEScene.blocks.forEach((item)=>{
        if(item.h_type=='connection') return;
        a_block = allBlocks.find((b) => b.id == item.contentItem.a_id);
        if(!a_block) return;
        item.contentItem.name = a_block.title
        item.contentItem.content = a_block.content_html
        item.contentItem.imageUrl = a_block.image ? a_block.image.thumb.url : '',
        item.updateDisplayElement();
      })
    },
    toggleLookoutSync(){
      this.THREEScene.cameraController.toggleLookoutSync();
      this.lookoutSyncActive= this.THREEScene.cameraController.lookoutSync
    },
    addLookout(){
      const rot = this.THREEScene.cameraController.rotation();
      const pos = this.THREEScene.cameraController.position();
      const node = {
        h_id: makeid(5),
        name:'',
        to:undefined,
        from:undefined,
        isFixed:true,
        content:'',
        h_type: 'lookout',
      }

      this.store.sceneList.push(node);
      forceSimulation.addNode({
        h_id: node.h_id,
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
      })
      window.location.hash=node.h_id;
      this.store.unsavedChanges++;
    },
    init(){
      this.THREEScene.thread.setup(this.THREEScene.blocks);
      nextTick(() => {
        this.store.unsavedChanges=0;
        if(window.innerWidth<700)this.store.isOrbit=true;
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
  position: fixed;
  z-index: var(--main-layer-one);
  user-select: none;
}

#node_info {
  background-color: white;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  z-index: var(--main-layer-four);
  margin: 0;
  width: auto;
  left: 50%;
  transform: translate(-50%, 110%);
  transition:transform .4s ease;
  box-shadow: 0 0 1em rgba(0,0,0,.25);
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
  word-break: break-all;
}
.description{
  margin-top: .7em;
  font-size: .8em;
}
#weave_from_btn, #weave_to_btn {
  color: var(--main-thread-color);
  flex-shrink: 0;
}

a {
  text-decoration:none;
}

.connection_properties {
  border:none;
  background:unset;
}
.connection_properties span {
  color:var(--main-connection-color);
  padding-bottom: 0.2rem;
}
@media (min-width:700px) {
  #node_info{
    max-width:50%;
  }
}
@media (max-width:700px) {
  #node_info{
    width: 100%;
    min-height: 4rem;
    max-height:20%;
    box-sizing: border-box;
    border-radius: unset;
  }
  #node_info.show{
    bottom: 0;
  }
  #node_info_text{
    overflow-y:auto;
  }
}

</style>