<template lang="html">
  <CanvasDragtarget @blockAdded="blockAdded"/>

  <div oncontextmenu="return false;" id="scene" ref="scene"></div>

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
      store:this.$root.store
    }
  },
  mounted(){
    const cameraSettings = {
    	zoomSpeed: 50,
    	moveSpeed: 5,
    	rotateSpeed: 0.15
    }

    this.forceSimulation=new ForceSimulation(this.graphData);
    this.THREEScene = new THREEScene(this.$refs.scene,this.forceSimulation,cameraSettings);
    this.THREEScene.onLinkAdded = (l) => {this.linkAdded(l)};
  },
  components:{
    CanvasDragtarget
  },
  computed:{
    links(){
      return this.graphData.links.length;
    },
    linkDistance(){
      return this.graphData.links.reduce((oldVal,item) => oldVal+item.distance,0);
    },
    isFocused(){
        return this.store.focused
      }
  },
  watch:{
    links(){
        console.log('links changed');
      },
    linkDistance(){
        this.forceSimulation.updateLinkDistances();
      },
    isFocused(){
        this.THREEScene.cameraController.enabled=!this.store.focused;
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

<style lang="css">
#scene{
  position:fixed;
  top:0;
  left:0;
  z-index:-1;
}

</style>
