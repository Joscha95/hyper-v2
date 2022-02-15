<template lang="html">
  <nested :children="store.sceneList"/>
</template>

<script>
import nested from "./components/nested-draggable.vue";
import {store} from './store.js';

export default {
  data(){
    return{
      store
    }
  },
  components:{
    nested
  }
}
</script>

<style lang="css">
 #THREEScene{
   position: absolute;
 }
</style>
