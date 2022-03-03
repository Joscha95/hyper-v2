<template>
  <collapsable id="panel">
    <div id="panel_header">
      <span v-for="widget in widgets" @click="widget.show=!widget.show" :class="{active:widget.show}">{{ widget.display }}</span>
    </div>
    <br>
    <div id="panel-inner">
      <component v-for="widget in activeWidgets" :is="widget.component"/>
    </div>
  </collapsable>
</template>

<script>
import SceneList from '@/components/stage/SceneList.vue';
import collapsable from '@/components/stage/subcomponents/collapsable.vue';


export default {
  name: 'Panel',
  components: {
    collapsable,
    SceneList
  },
  data(){
    return{
      widgets:[
        {component:'SceneList', display: 'scene',show:true}
      ]
    }
  },
  computed:{
    activeWidgets(){
      return this.widgets.filter((w)=> w.show)
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
  --yellow:#fffbe9;
}

#panel {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position:absolute;
  right:0;
  top:0;
  height:100vh;
  z-index:1;
}

#panel-inner{
  display:flex;
  grid-column-gap:5%;
}

#panel-inner> div{
  flex:1;
  width:200px;
}

.sortable-ghost{
  cursor:grab;
  opacity:0.3;
}

#panel_header{
  text-align:center
}

.highlight{
  box-shadow: 0 0 2px #2196F3;
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
.list-group-item .handle{
  padding: 10px 0;
}

.delete{
  color:var(--main-error-color);
}

.dragArea .handle:active{
  cursor:grabbing;
}

.handle{
  cursor:pointer;
}

.list-group{
  min-height:2.5em;
}

.selected-by-drag{
  border:1px solid blue !important;
}

.selected{
  background-color:var(--yellow);
}

*[type="connection"]{
  color:blue
}

.list-group-item[type*="con"] + .list-group-item[type*="con"]{
  border-top:0;
}

.floating-blocks{
  pointer-events:none;
  font-size:3em;
  line-height:1.3;
  background-color:#e3e3e3;
  padding:5px;
}

.floating-blocks[contentclass="Text"]{
  max-width:200px;
}

.floating-blocks.connection{
  background-color:white;
  border:1px blue solid;
  padding:5px;
}

.floating-blocks.focus{
  background-color:transparent;
}
</style>

<style scoped>
header{
  text-align:left;
}
  header span{
    margin-right:1em;
    opacity:.4;
    cursor:pointer;
  }

  .active{
    font-weight:bolder;
    opacity:1
  }
</style>
