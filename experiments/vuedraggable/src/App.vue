<template>
  <collapsable>
    <header>
      <toggle v-model="addBlocks" :bool="addBlocks"/>
    </header>
    <br>
    <div id="panel">
      <Scene/>
      <AllBlocks v-show="addBlocks"/>
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
    AllBlocks,
    Inspector,
    collapsable,
    Scene,
    toggle
  },
  data(){
    return{
      addBlocks:true,
    }
  }
}
</script>

<style>
:root{
  --border:1px solid rgb(230,230,230);
  --gray1:rgb(250,250,250);
  --gray2:rgb(230,230,230);
}

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
  display:grid;
  grid-template-columns: 47.5% 47.5% ;
  grid-column-gap:5%;
}

#panel> div{
  flex:1;
}
.sortable-ghost{
  cursor:grab;
  opacity:0.3;
}

.highlight{
  box-shadow: 0 0 2px #2196F3;
}

.list-group-item{
  cursor:pointer;
  padding: 10px 0;
  border:var(--border);
}
.list-group-item:active{
  cursor:grabbing;
}

.list-group{
  min-height:2.5em;
  background-color:var(--gray1)
}
</style>
