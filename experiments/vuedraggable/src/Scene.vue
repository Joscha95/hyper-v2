<template lang="html">
  <draggable
    class="drag-area list-group"
    :list="store.sceneList"
    :group="{ name: ['blocks'],pull:false,put:true}"
    item-key="uuid"
  >
  <template #item="{ element }">
    <div class="list-group-item" :type="element.type" >
        {{ element.name }}
    </div>
  </template>
  </draggable>

</template>

<script>
import draggable from "vuedraggable";
import {store} from './store.js';

export default {
  data(){
    return{
      store
    }
  },
  components:{
    draggable
  },
  methods:{
  }
}
</script>

<style lang="css">
 #THREEScene{
   position: absolute;
   top:0;
   left:0;
   width:100vw;
   height:100vh;
 }
 .drag-area{
   height:100%;
 }
</style>
