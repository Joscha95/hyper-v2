<template>
  <div id="all-blocks">
    <div id="all-blocks-header">
      <strong @click="show=!show" id="add-block-button">add blocks</strong>
      <searchbar v-show="show" @search="filterBlocks" />
    </div>
    <div id="all-blocks-body" v-show="show">
      <draggable
        class="dragArea list-group"
        :list="blocks"
        :group="{ name: 'arena-blocks', pull: 'clone', put: false }"
        :sort="false"
        :clone="cloneBlock"
        @start="toggleCanvasDragTarget"
        @end="toggleCanvasDragTarget"
        @move="onMove"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item" v-show="element.name.toLowerCase().includes(searchstring)">
            <span>{{ element.name }}</span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/stage/subcomponents/searchbar.vue";
import blocks from "@/cooking.js";
import {makeid} from'@/modules/Helpers.js'

let idGlobal = 8;
export default {
  order: 3,
  components: {
    draggable,
    searchbar
  },
  data() {
    return {
      blocks: blocks.nodes,
      store:this.$root.$data.store,
      lastSelected:null,
      searchstring:'',
      show:true
    };
  },
  mounted(){
    console.log(this.$root.store);
  },
  methods: {
    toggleCanvasDragTarget(e){
      switch (e.type) {
        case 'start':
          this.store.isDragging=true
          break;
        case 'end':
          this.store.isDragging=false;
          if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
          this.lastSelected=null;
          break;
        default:
      }
    },
    cloneBlock({ name,id }) {
      return {
        a_id: id,
        h_id: makeid(5),
        name: name,
        to:[],
        from:[],
        isFixed:false,
        content:name,
        h_type: 'content'
      };
    },
    onMove(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
      this.lastSelected=evt.to;
      this.lastSelected.classList.add('selected-by-drag')
    },
    filterBlocks(e){
      this.searchstring=e.value.toLowerCase()
    }
  }
};
</script>
<style>
  :root {
    --header-height: 5rem;
  }
</style>>
<style scoped>
  #all-blocks{
    position:fixed;
    height:100%;
    z-index:1;
    user-select:none;
    top:0;
    width:15rem;
  }
  #all-blocks-header{
    position:absolute;
    width: 100%;
    display: flex;
    align-content: space-between;
    flex-wrap: wrap;
    height: var(--header-height);
  }
  #all-blocks-body{
    position:absolute;
    width: 100%;
    overflow-y:auto;
    top: calc(var(--header-height) + 3px );
    bottom: 0;
    background: white;
  }
  #add-block-button{
    padding: .5em;
  }
  .list-group-item{
    background-color:white;
    text-align: left;
    box-sizing: border-box;
    padding: 0 .3em;
  }
  .list-group-item + .list-group-item{
    border-top:0;
  }
</style>