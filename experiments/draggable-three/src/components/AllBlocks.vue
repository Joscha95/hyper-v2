<template>
  <div class="widget-area">
    <strong>all blocks</strong>
    <br>
    <br>
    <draggable
      class="dragArea list-group"
      :list="blocks"
      :group="{ name: 'blocks', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneBlock"
      @start="toggleCanvasDragTarget"
      @end="toggleCanvasDragTarget"
      @move="onMove"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="list-group-item">
          <span>{{ element.name }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

let idGlobal = 8;
export default {
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      blocks: [
        { name: "dog 1", id: 1 },
        { name: "dog 2", id: 2 },
        { name: "dog 3", id: 3 },
        { name: "dog 4", id: 4 }
      ],
      store:this.$root.$data.store,
      lastSelected:null
    };
  },
  methods: {
    toggleCanvasDragTarget(e){
      switch (e.type) {
        case 'start':
          this.store.isDragging=true
          break;
        case 'end':
          this.store.isDragging=false
          break;
        default:
      }
    },
    cloneBlock({ name,id }) {
      return {
        id: id,
        h_uuid:'_'+Date.now(),
        name: name,
        to:[],
        from:[],
        children:[],
        h_type: 'content'
      };
    },
    onMove(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
      this.lastSelected=evt.to;
      this.lastSelected.classList.add('selected-by-drag')
    }
  }
};
</script>
<style scoped>
  .list-group-item{
    background-color:white;
  }

  .list-group-item + .list-group-item{
    border-top:0;
  }
</style>