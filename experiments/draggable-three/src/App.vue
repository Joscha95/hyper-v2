<template>
  <Graph/>
  <Panel/>
  <AllBlocks/>
</template>

<script>
import Graph from '@/components/stage/Graph.vue'
import Panel from '@/components/stage/Panel.vue'
import AllBlocks from '@/components/stage/AllBlocks.vue'
import store from '@/store.js';

export default {
  name: 'App',
  data(){
    return{
      store,
    }
  },
  components: {
    Graph,
    Panel,
    AllBlocks
  }
}
</script>

<style>

</style>
