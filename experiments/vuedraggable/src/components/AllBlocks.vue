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
      @change="log"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="list-group-item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import collapsable from "./collapsable.vue";
let idGlobal = 8;
export default {
  name: "AllBlocks",
  order: 3,
  components: {
    draggable,collapsable
  },
  data() {
    return {
      blocks: [
        { name: "dog 1", id: 1 },
        { name: "dog 2", id: 2 },
        { name: "dog 3", id: 3 },
        { name: "dog 4", id: 4 }
      ]
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    cloneBlock({ name,id }) {
      return {
        id: id,
        uuid:'_'+Date.now(),
        name: name,
        to:[],
        from:[],
        children:[],
        type: content
      };
    }
  }
};
</script>
<style scoped>
  .list-group-item{
    background-color:white;
  }
</style>