<template lang="html">
  <CanvasDragtarget @blockAdded="blockAdded"/>

  <div @click="addItem" oncontextmenu="return false;" id="scene" ref="scene"></div>

  <div @click="removeItem">
  remove
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
          "nodes": [],
          "links": []
      },
      THREEScene:null,
      forceSimulation:null
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
  },
  components:{
    CanvasDragtarget
  },
  methods:{
    blockAdded(b){
      const pos = this.THREEScene.getWorldPosition(b.clientX,b.clientY)
      const ele = b.element;
      ele.x=pos.x
      ele.y=pos.y
      ele.z=pos.z
      ele.val=1

      this.graphData.nodes.push(ele)
      this.forceSimulation.setNodes(this.graphData.nodes)
    },
    removeItem(){
      this.graphData.nodes.pop();
      this.forceSimulation.setNodes(this.graphData.nodes)
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
