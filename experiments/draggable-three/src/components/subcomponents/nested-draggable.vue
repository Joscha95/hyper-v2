<template>
  <draggable
    class="dragArea list-group"
    :list="children"
    :group="{ name: 'object',pull:onPull,put:true}"
    @move="onMove"
    @end="onEnd"
    @change="onChange"
    animation="50"
    item-key="uuid"
  >
    <template #item="{ element }">
      <div class="list-group-item"
      :class="selectedObjectId==element.h_id ? 'selected': '' "
      :type="element.h_type" v-if="element.name.includes(searchstring)"
      @dblclick="onDoubleClick($event,element)">

        <span @click="store.selectedObject=element">{{ element.name }}</span>

        <nested-draggable v-if="element.h_type=='group'" :children="element.children ? element.children : []" />
      </div>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";


export default {
  props: {
    children: {
      required: true,
      type:Array,
    },
    searchstring:''

  },
  data(){
    return{
      store:this.$root.$data.store,
      lastSelected:null
    }
  },
  computed:{
    selectedObjectId(){
      return this.store.selectedObject ? this.store.selectedObject.h_id : ''
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
    onChange(evt){
      this.$emit('change',evt);
    },
    onEnd(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
      this.lastSelected=null;
    },
    onDoubleClick(e,element){
      window.location.hash=element.h_id;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    },
    getElementName(element){
      return element.h_type=='connection' ?  element.source.name +' -> '+ element.target.name : element.name;
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