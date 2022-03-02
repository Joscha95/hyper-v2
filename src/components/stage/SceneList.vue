<template>
    <div class="widget-area" >
      <strong>composition</strong><br>
      <searchbar @search="filterBlocks" />

      <draggable
        class="dragArea list-group"
        :list="store.sceneList"
        :group="{ name: 'object',pull:onPull,put:true}"
        @move="onMove"
        @end="onEnd"
        @change="onChange"
        handle=".handle"
        animation="50"
        item-key="h_id"
      >
        <template #item="{ element }">
          <div class="list-group-item"
          :class="selectedObjectId==element.h_id ? 'selected': '' "
          :type="element.h_type" v-if="element.name.includes(searchstring)"
          @dblclick="onDoubleClick($event,element)">
            <node-list-element :element="element"/>
          </div>
        </template>
      </draggable>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/stage/subcomponents/searchbar.vue";
import nodeListElement from "@/components/stage/subcomponents/node-list-element.vue";

let idGlobal = 8;
export default {
  name: "SceneList",
  order: 3,
  data(){
    return{
      store:this.$root.store,
      searchstring:'',
      lastSelected:null
    }
  },
  components:{
    searchbar,draggable,nodeListElement
  },
  computed:{
    selectedObjectId(){
      return this.store.selectedObject ? this.store.selectedObject.h_id : ''
    }
  },
  methods:{
    addGroup: function() {
      this.store.sceneList.push({
        name:"new Group",
        h_id:'_'+Date.now(),
        h_type:'group',
        children:[],
        from:[],
        to:[]
      })
    },
    filterBlocks(e){
      this.searchstring=e.value
    },
    onChange(evt){
      this.$emit('change',evt)
    },
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
  }
};
</script>
<style scoped>
  .addgroup{
    cursor:pointer;
    font-size:.7em;
    text-align:right;
  }

</style>