<template>
    <div class="widget-area" >
      <strong>composition</strong>
      <br>
      <br>
      <draggable
        class="dragArea list-group"
        :list="sceneList"
        :group="{ name: 'blocks', pull: 'clone' }"
        :removeOnSpill="false"
        @spill="spill"
        animation="150"
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
    },
    spill: function(evt) {
      if(this.sceneList.splice(evt.oldIndex,1)[0]==store.selectedObject) store.selectedObject=null;
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