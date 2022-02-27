<template lang="html">
  <CanvasDragtarget @blockAdded="blockAdded"/>

  <div oncontextmenu="return false;" id="scene" ref="scene"></div>

  <div id="chain_navigator" :class="currentActiveChainElement?'show':''" v-if="lastValidChainElement" >
   <a v-if = "lastValidChainElement.from[0]" :href="'#'+lastValidChainElement.from[0].h_uuid"> {{ lastValidChainElement.from[0].name }} ⇢ </a>
    {{ lastValidChainElement.name }}
  <a v-if = "lastValidChainElement.to[0]" :href="'#'+lastValidChainElement.from[0].h_uuid"> ⇢ {{ lastValidChainElement.to[0].name }} </a>
  </div>

</template>

<script>
import ForceSimulation from '@/modules/3dForceSimulation.js';
import THREEScene from '@/modules/THREEScene.js';
import CanvasDragtarget from '@/components/CanvasDragtarget.vue';

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
    currentActiveChainElement(){
      return this.store.activeChainElement ? this.store.sceneList.find((n)=>n.h_uuid==this.store.activeChainElement ) : undefined;
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
      if(newVal) this.THREEScene.focusItem(this.store.selectedObject.h_uuid,this.store.selectedObject.h_type)
    },
    currentActiveChainElement(newVal){
      if (newVal) this.lastValidChainElement=newVal
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

      //this.graphData.nodes.push(ele)
      this.forceSimulation.setNodes(this.graphData.nodes)
    },
    linkAdded(l){
      this.graphData.nodes.push(l.node)
      this.forceSimulation.setNodes(this.graphData.nodes)

      this.graphData.links.push(l.link1);
      this.graphData.links.push(l.link2);
      this.forceSimulation.addLink(l.link1);
      this.forceSimulation.addLink(l.link2);
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
