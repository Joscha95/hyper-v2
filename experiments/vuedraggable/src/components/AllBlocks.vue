<template>
  <collapsable>
    <div class="widget-area">
      <h3>All blocks</h3>
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
  </collapsable>
</template>

<script>
import draggable from "vuedraggable";
import collapsable from "./collapsable.vue";
let idGlobal = 8;
console.log(Date.now());
export default {
  name: "AllBlocks",
  order: 3,
  components: {
    draggable,collapsable
  },
  data() {
    return {
      blocks: [
        { name: "dog 1", id: 1, to:[],from:[] },
        { name: "dog 2", id: 2, to:[],from:[] },
        { name: "dog 3", id: 3, to:[],from:[] },
        { name: "dog 4", id: 4, to:[],from:[] }
      ]
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    cloneBlock({ name,id }) {
      console.log(name);
      return {
        id: id,
        uuid:'_'+Date.now(),
        name: name,
        to:[],from:[]
      };
    }
  }
};
</script>
<style scoped>

</style>