<template>
    <div class="widget-area" >
      <strong>scene</strong>
      <draggable
        class="dragArea list-group"
        :list="sceneList"
        :group="{ name: 'blocks', pull: 'clone' }"
        animation="150"
        @change="log"
        item-key="uuid"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="selectedObjectId==element.uuid ? 'selected': '' " @click="store.selectedObject=element">
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
      store
    }
  },
  computed:{
    selectedObjectId(){
      return store.selectedObject ? store.selectedObject.uuid : ''
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
  cursor:pointer;
}

.selected{
  color:blue;
}

</style>