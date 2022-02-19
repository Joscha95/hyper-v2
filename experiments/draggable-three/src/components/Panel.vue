<template>
  <collapsable id="panel">
    <header>
      <span @click="activeWidget='addBlocks'">blocks</span>
      <span @click="activeWidget='editScene'"> object</span>
    </header>
    <br>
    <div id="panel-inner">
      <AllBlocks v-if="activeWidget=='addBlocks'"/>
      <SceneList/>
      <Inspector v-if="activeWidget=='editScene'"/>
    </div>
  </collapsable>
</template>

<script>
import AllBlocks from '@/components/AllBlocks.vue';
import Inspector from '@/components/Inspector.vue';
import SceneList from '@/components/SceneList.vue';
import collapsable from '@/components/subcomponents/collapsable.vue';


export default {
  name: 'Panel',
  components: {
    AllBlocks,
    Inspector,
    collapsable,
    SceneList
  },
  data(){
    return{
      activeWidget:'addBlocks',
    }
  }
}
</script>

<style>
:root{
  --border:1px solid rgb(230,230,230);
  --gray1:rgb(250,250,250);
  --gray2:rgb(230,230,230);
  --gray3:rgb(200,200,200);
}

#panel {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position:absolute;
  right:0;
  top:0;
  height:100vh;
}

#panel-inner{
  display:grid;
  grid-template-columns: 47.5% 47.5% ;
  grid-column-gap:5%;
}

#panel-inner> div{
  flex:1;
}

.sortable-ghost{
  cursor:grab;
  opacity:0.3;
}

header{
  text-align:center
}

.highlight{
  box-shadow: 0 0 2px #2196F3;
}

.dragArea{
  text-align:center;
}

.dragArea .dragArea{
  width:90%;
  display:inline-block;
}

.list-group-item{
  border:var(--border);
}

.list-group-item span{
  cursor:pointer;
  display:inline-block;
  padding: 10px 0;
}

.list-group-item:active{
  cursor:grabbing;
}

.list-group{
  min-height:2.5em;
  background-color:var(--gray1)
}

.selected-by-drag{
  border:1px solid blue !important;
}

.selected{
  color:blue;
}

.list-group-item[type="content"] + .list-group-item[type="content"]{
  border-top:0;
}
</style>
