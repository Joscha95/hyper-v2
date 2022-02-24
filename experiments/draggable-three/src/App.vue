<template>
  <Graph/>
  <Panel/>
  <AllBlocks/>
</template>

<script>
import Graph from '@/components/Graph.vue'
import Panel from '@/components/Panel.vue'
import AllBlocks from '@/components/AllBlocks.vue'
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
