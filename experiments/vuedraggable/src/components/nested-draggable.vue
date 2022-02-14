<template>
  <draggable
    class="dragArea list-group"
    :list="children"
    :group="{ name: 'blocks' ,pull:true}"
    animation="150"
    item-key="uuid"
  >
    <template #item="{ element }">
      <div class="list-group-item" :class="selectedObjectId==element.uuid ? 'selected': '' " @click="store.selectedObject=element">
        {{ element.name }}
        <nested-draggable v-if="element.type=='group'" :children="element.children ? element.children : []" />
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import {store} from '../store.js';


export default {
  props: {
    children: {
      required: true,
      type:Array
    }
  },
  data(){
    return{
      store
    }
  },
  computed:{
    selectedObjectId(){
      return store.selectedObject ? store.selectedObject.uuid : ''
    }
  },
  components: {
    draggable
  },
  name:"nested"
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