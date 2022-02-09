<template>
    <div class="widget-area" v-if="store.selectedObject" >
      <draggable
        class="dragArea list-group"
        :list="store.selectedObject.from "
        group="blocks"
        @change="log"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.id==element.id ? 'selected': '' " @click="store.selectedObject=element">
            {{ element.name }}
          </div>
        </template>
      </draggable>
      &darr;
      <input type="text" name="" v-model="store.selectedObject.name"><br>
      <small>id: {{ store.selectedObject.id }}</small><br>
      <small>uuid: {{ store.selectedObject.uuid }}</small><br>
      &darr;
      <draggable
        class="dragArea list-group"
        :list="store.selectedObject.to"
        group="blocks"
        @change="log"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.id==element.id ? 'selected': '' " @click="store.selectedObject=element">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <div v-else>
      No Object selected.
    </div>
</template>

<script>
import draggable from "vuedraggable";
import {store} from '../store.js';

let idGlobal = 8;
export default {
  name: "Inspector",
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      store,
    };
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