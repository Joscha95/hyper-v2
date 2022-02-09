<template>
  <div id="widget">
    <AllBlocks/>
    <Panel/>
  </div>
</template>

<script>
import AllBlocks from './components/AllBlocks.vue';
import Panel from './components/Panel.vue';


export default {
  name: 'App',
  components: {
    AllBlocks,Panel
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#widget{
  position:absolute;
  right:0;
  top:0;
  height:100vh;
}
</style>
