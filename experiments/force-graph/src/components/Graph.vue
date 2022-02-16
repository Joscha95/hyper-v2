<template lang="html">
  <div class="" @click="addItem">
  click me
  </div>
  <div ref="graph">haha</div>
</template>

<script>
import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'


export default {
  data(){
    return{
      graphData:{
          "nodes": [
              {
                "id": "id1",
                "name": "name1",
                "val": 1
              },
              {
                "id": "id2",
                "name": "name2",
                "val": 10
              },
          ],
          "links": [
              {
                  "source": "id1",
                  "target": "id2"
              },
          ]
      },
      graph:null
    }
  },
  mounted(){
    this.graph=new ForceGraph3D({
      controlType:'orbit'
    })(this.$refs.graph)
    this.graph.graphData(this.graphData);
    this.graph.backgroundColor('#e8e8e8');
    console.log(this.graph.controls());
  },
  methods:{
    addItem(){
      const dir = new THREE.Vector3();
      let cPos = this.graph.cameraPosition();
      cPos = new THREE.Vector3(cPos.x,cPos.y,cPos.z);
      this.graph.camera().getWorldDirection(dir);
      dir.normalize();

      cPos.addScaledVector(dir,100);

      this.graphData.nodes.push({
        "id": "id_"+Date.now(),
        "name": "name3",
        "val": 10,
        'fx':cPos.x,
        'fy':cPos.y,
        'fz':cPos.z
      });

      this.graph.graphData(this.graphData);
    }
  }
}
</script>

<style lang="css" scoped>
</style>
