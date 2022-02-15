<template>
  <draggable
    class="dragArea list-group"
    :list="children"
    :group="{ name: ['blocks','object'],pull:onPull,put:true}"
    @move="onMove"
    @end="onEnd"
    animation="50"
    item-key="uuid"
  >
    <template #item="{ element }">
      <div class="list-group-item" :type="element.type" >
        <span
          @click="store.selectedObject=element"
          :class="selectedObjectId==element.uuid ? 'selected': '' ">
          {{ element.name }}
        </span>
        <nested-draggable v-if="element.type=='group'" :children="element.children ? element.children : []" />
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import {store} from '../../store.js';


export default {
  props: {
    children: {
      required: true,
      type:Array
    }
  },
  data(){
    return{
      store,
      lastSelected:null
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
  name:"nested",
  methods: {
    onPull(evt){
      return evt.options.group.name=='object' ? 'clone' :true;
    },
    onMove(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
      this.lastSelected=evt.to;
      this.lastSelected.classList.add('selected-by-drag')
    },
    onEnd(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
      this.lastSelected=null;
    }
  }
};
</script>
<style scoped>
.list-group-item{
  cursor:pointer;
}

.list-group-item[type="group"]{
  margin:8px 0;
  padding-bottom:10px;
}

</style>