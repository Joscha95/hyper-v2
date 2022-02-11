<template>
  <collapsable>
    <header>
      <toggle v-model="addBlocks" :bool="addBlocks"/>
    </header>
    <br>
    <div id="panel">
      <AllBlocks v-show="addBlocks"/>
      <Scene/>
      <Inspector v-show="!addBlocks"/>
    </div>
  </collapsable>
</template>

<script>
import AllBlocks from './components/AllBlocks.vue';
import Inspector from './components/Inspector.vue';
import Scene from './components/Scene.vue';
import collapsable from './components/collapsable.vue';
import toggle from './components/toggle.vue';


export default {
  name: 'App',
  components: {
    AllBlocks,Inspector,collapsable,Scene,toggle
  },
  data(){
    return{
      addBlocks:true,
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position:absolute;
  text-align:center;
  right:0;
  top:0;
  height:100vh;
}

#panel{
  display:flex;
}

#panel> div{
  flex:1;
}
.sortable-ghost{
  cursor:grab;
}

.highlight{
  box-shadow: 0 0 2px #2196F3;
}

.list-group-item{
  cursor:pointer;
}
.list-group-item:active{
  cursor:grabbing;
}
</style>
