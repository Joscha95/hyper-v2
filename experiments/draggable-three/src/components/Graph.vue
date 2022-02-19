<template lang="html">
  <div @click="addItem" oncontextmenu="return false;" id="scene" ref="scene"></div>

  <div @click="removeItem">
  remove
  </div>
</template>

<script>
import ForceSimulation from '@/modules/3dForceSimulation.js';
import THREEScene from '@/modules/THREEScene.js';

export default {
  data(){
    return{
      graphData:{
          "nodes": [
              {
                "hyperID": "id1",
                "name": "name1",
                "val": 1
              },
              {
                "hyperID": "id2",
                "name": "name2",
                "val": 1
              },
          ],
          "links": [
              {
                  "source": "id1",
                  "target": "id2"
              },
          ]
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
  methods:{
    addItem(e){
      const pos=this.THREEScene.getWorldPosition(e.clientX,e.clientY)
      this.graphData.nodes.push({
        "hyperID": "id_"+Date.now(),
        "name": "name3",
        "val": 1,
        'x':pos.x,
        'y':pos.y,
        'z':pos.z
      });
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
