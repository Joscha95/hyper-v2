<template>
    <div class="widget-area" >
      <draggable
        class="dragArea list-group"
        :list="sceneList"
        group="blocks"
        :animation="150"
        @change="log"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="selectedObjectId==element.id ? 'selected': '' " @click="store.selectedObject=element">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import {store} from '../store.js';

let idGlobal = 8;
export default {
  name: "Scene",
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      sceneList: [],
      store,
    }
  },
  computed:{
    selectedObjectId(){
      return store.selectedObject ? store.selectedObject.id : ''
    }
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    }
  }
};
</script>
<style scoped>
.list-group-item{
  cursor:grab;
}

.selected{
  color:blue;
}

</style>