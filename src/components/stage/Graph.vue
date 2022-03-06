<template lang="html">
  <CanvasDragtarget @blockAdded="blockAdded"/>

  <div oncontextmenu="return false;" id="scene" ref="scene"></div>

  <div id="toolbox_wrapper"></div>

  <div id="chain_navigator" :class="currentelementInCameraView?'show':''" v-if="lastValidChainElement" >
    <a v-if = "lastValidChainElement.from" :href="'#'+lastValidChainElement.from.h_id"> {{ lastValidChainElement.from.name }} ⇢ </a>

    <div class="bold" v-if="lastValidChainElement.name!=''">{{ lastValidChainElement.name }}</div>
    <div class="description" v-if="lastValidChainElement.description!=''"  v-html="lastValidChainElement.description"></div>
    <div class="description" v-if="lastValidChainElement.content!='' && lastValidChainElement.h_type=='lookout'">{{ lastValidChainElement.content }}</div>

    <a v-if = "lastValidChainElement.to" :href="'#'+lastValidChainElement.to.h_id"> ⇢ {{ lastValidChainElement.to.name }} </a>
  </div>


</template>

<script>
import ForceSimulation from '@/modules/3dForceSimulation.js';
import THREEScene from '@/modules/THREEScene.js';
import {makeid} from '@/modules/Helpers.js';
import CanvasDragtarget from '@/components/stage/CanvasDragtarget.vue';

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
    CanvasDragtarget
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
      const mode = val ? '⥁ Orbit' : '⟴ First person'
      this.$root.notify('Camera is now: '+mode, 'default',2000)
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
      this.graphData.nodes.push(l.node)
    },
    updateContents(allBlocks){
      let a_block;
      this.graphData.nodes.forEach((item)=>{
        if(item.h_type=='connection') return;
        a_block = allBlocks.find((b) => b.id == item.a_id);
        if(!a_block) return;
        item.name= a_block.title
        item.content = a_block.content
        item.imageUrl = a_block.image ? a_block.image.thumb.url : '',
        item.sceneElement.updateDisplayElement();
      })
    },
    addLookout(){
      const rot = this.THREEScene.cameraController.rotation();
      const pos = this.THREEScene.cameraController.position();
      const node = {
        h_id: makeid(5),
        name:'⩥',
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

      this.store.sceneList.push(node)
    },
    init(){
      this.graphData.nodes=this.$root.store.sceneList;
      this.graphData.links=this.graphData.nodes.filter((n) => n.h_type=='connection').map((n) => n.links).flat()
      this.forceSimulation.updateGraph();
      this.THREEScene.thread.setup(this.THREEScene.blocks);
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

.description{
  margin-top:.5em;
  font-size:.7em;
}

#chain_navigator{
  position:fixed;
  bottom:0;
  z-index:100;
  margin: 0 auto;
  width:auto;
  left:50%;
  transform:translate(-50%,150%);
  transition:transform .3s ease;
  background-color:white;
  border-radius:1em;
  padding:10px;
}
#chain_navigator.show{
  transform:translate(-50%,0%)
}
a{
  text-decoration:none;
}

</style>

<style media="screen">
  .toolbox{
    position:fixed;
    background-color:white;
    box-shadow:0 0 5px rgba(0,0,0,0.3);
    transform: translate(15%);
    border-radius: 5px;
    overflow:hidden;
  }

  .toolbox div{
    cursor:pointer;
    padding:1em 0;
    width:45px;
    text-align:center
  }

  .toolbox div:hover{
    background-color:rgb(245,245,245)
  }

  .toolbox div:active{
    background-color:rgb(235,235,235)
  }

  .toolbox div + div{
    border-top:solid 1px black;
  }

  #thread_plus{
    position:fixed;
    padding:.5em;
    border-radius:1em;
    background:white;
  }

  .cursor_pointer{
    cursor:pointer;
  }
</style>
