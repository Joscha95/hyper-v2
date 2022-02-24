<template>
  <div id="all-blocks">
    <strong @click="show=!show">add blocks</strong>
    <div class="widget-area" v-show="show">
      <searchbar @search="filterBlocks" />
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
          <div class="list-group-item" v-show="element.name.includes(searchstring)">
            <span>{{ element.name }}</span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/subcomponents/searchbar.vue";
import blocks from "@/cooking.js";

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
      show:false
    };
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
        h_uuid:'H'+Date.now(),
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
      this.searchstring=e.value
    }
  }
};
</script>
<style scoped>
#all-blocks{
  position:fixed;
  height:100%;
  overflow-y:auto;
  z-index:1;
}
  .list-group-item{
    background-color:white;
  }

  .list-group-item + .list-group-item{
    border-top:0;
  }
</style>