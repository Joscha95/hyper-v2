<template>
    <div class="widget-area" v-if="store.selectedObject" >
      <strong>object</strong>
      <draggable
        class="dragArea list-group"
        :list="store.selectedObject.from "
        :group="{ name: 'blocks', pull:false }"
        @change="log"
        @add="addedItem($event,'from')"
        item-key="uuid"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.uuid==element.uuid ? 'selected': '' " >
             <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.from=[]">x</span>
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
        @add="addedItem($event,'to')"
        item-key="uuid"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.uuid==element.uuid ? 'selected': '' ">
            <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.to=[]">x</span>
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
      store
    };
  },
  methods: {
    log(evt){
      window.console.log(evt);
    },
    addedItem(evt,list){
      const ele = store.selectedObject[list][evt.newIndex];
      store.selectedObject[list]=[ele];
    }
  }
};
</script>
<style scoped>
.list-group-item{
  cursor:pointer;
}

.widget-area{
  text-align:center
}

.name:hover{
  text-decoration:underline
}

.selected{
  color:blue;
}

</style>