<template lang="html">
  <draggable
    class="drag-area list-group"
    :class="store.isDragging ? 'active' : ''"
    id="canvas_dragtarget"
    :list="store.sceneList"
    :group="{ name: 'arena-blocks',pull:false,put:true}"
    @add="added"
    @change="changed"
    item-key="uuid"
  >
  <template #item="{ element }">
    <div class="list-group-item" :type="element.type" >
        {{ element.name }}
    </div>
  </template>
  </draggable>

</template>

<script>
import draggable from "vuedraggable";

export default {
  data(){
    return{
      store:this.$root.$data.store,
      lastAdded:null
    }
  },
  components:{
    draggable
  },
  methods:{
    added(e){
      if(this.lastAdded) this.$emit('blockAdded',{
        element:this.lastAdded,
        clientX:e.originalEvent.clientX,
        clientY:e.originalEvent.clientY
      })
      this.lastAdded=null;
      
    },
    changed(e){
      // this is a vue event, i also need the mouse pos, so the event is emitted from added evenet (which originates from dom)
      if(e.added) this.lastAdded=e.added.element;
    }
  }
}
</script>

<style lang="css">
 #canvas_dragtarget{
   position: fixed;
   background-color:transparent;
   top:0;
   left:0;
   width:100%;
   height:100%;
   opacity:0;
 }
 .drag-area{
   pointer-events:none;
 }
 .drag-area.active{
   opacity:1;
   pointer-events:all;
 }
</style>
