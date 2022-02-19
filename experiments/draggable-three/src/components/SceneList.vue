<template>
    <div class="widget-area" >
      <strong>composition</strong><br>
      <br>
      <div class="addgroup" @click="addGroup">
        + new group
      </div>
      <br>
      <nested :children="store.sceneList" @change="onChange"/>
    </div>
</template>

<script>
import nested from "@/components/subcomponents/nested-draggable.vue";


let idGlobal = 8;
export default {
  name: "SceneList",
  order: 3,
  data(){
    return{
      store:this.$root.$data.store
    }
  },
  components:{
    nested
  },
  methods:{
    addGroup: function() {
      this.store.sceneList.push({
        name:"new Group",
        h_uuid:'_'+Date.now(),
        type:'group',
        children:[],
        from:[],
        to:[]
      })
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