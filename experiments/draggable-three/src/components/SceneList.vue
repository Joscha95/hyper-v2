<template>
    <div class="widget-area" >
      <strong>composition</strong><br>
      <br>
      <div class="addgroup" @click="addGroup">
        + new group
      </div>
      <br>
      <nested :children="store.sceneList"/>
    </div>
</template>

<script>
import nested from "@/components/subcomponents/nested-draggable.vue";
import {store} from '@/store.js';


let idGlobal = 8;
export default {
  name: "SceneList",
  order: 3,
  data(){
    return{
      store
    }
  },
  components:{
    nested
  },
  methods:{
    addGroup: function() {
      store.sceneList.push({
        name:"new Group",
        uuid:'_'+Date.now(),
        type:'group',
        children:[],
        from:[],
        to:[]
      })
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