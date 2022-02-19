<template>
  <Graph/>
  <Panel/>
</template>

<script>
import Graph from '@/components/Graph.vue'
import Panel from '@/components/Panel.vue'
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
    Panel
  }
}
</script>

<style>

</style>
