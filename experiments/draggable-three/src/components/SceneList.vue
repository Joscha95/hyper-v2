<template>
    <div class="widget-area" >
      <strong>composition</strong><br>
      <searchbar @search="filterBlocks" />
      <nested :children="store.sceneList" :searchstring="searchstring" @change="onChange"/>
    </div>
</template>

<script>
import nested from "@/components/subcomponents/nested-draggable.vue";
import searchbar from "@/components/subcomponents/searchbar.vue";

let idGlobal = 8;
export default {
  name: "SceneList",
  order: 3,
  data(){
    return{
      store:this.$root.store,
      searchstring:''
    }
  },
  components:{
    nested,
    searchbar
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
    }
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