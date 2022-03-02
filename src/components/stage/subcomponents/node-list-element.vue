<template>
      <div v-if="isConnection && editmode" :type="element.h_type">
        <textarea @focus="store.focused=true" @blur="store.focused=false" rows="5" v-model="element.content" placeholder="say something about the connection"></textarea>
      </div>
      <div v-else @click="store.selectedObject=element" class="handle">
        {{ element.name }}
      </div>

      <div v-if="store.selectedObject==element">
        <div class="property-field" >
          <toggle off="↔" on="⥿" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="element.isFixed" v-model="element.isFixed"/>
          <span v-if="isConnection" class="button" @click="editmode=!editmode">{{ editmode ? 'done' :'edit' }}</span>
        </div>
        <!-- off="↔" on="⥿"  off="⌱" on="⌖"-->

        <div class="" v-if="isConnection">
          <span class="links" @click="element=connectedNodes.source" :title="connectedNodes.source.name">◯ </span>
          <draggableNumber :value="linkDistance" v-model="linkDistance"/>
          <span class="links" @click="element=connectedNodes.target" :title="connectedNodes.target.name"> ◯</span>
          <!-- ◯ ◉ ◼ -->
        </div>

        <div class="deleteItem" :class="remove ? 'delete' : ''">
          <span v-if="!remove" @click="remove=true">remove</span>
          <span v-else="" @click="removeItem">sure?</span>
        </div>
        <!-- <div class="meta">
          a_id: {{ element.a_id }}<br>
          h_id: {{ element.h_id }}<br>
        </div> -->
      </div>

</template>

<script>
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'
import {Vector3} from 'three'

let idGlobal = 8;
export default {
  order: 3,
  components: {
    draggableNumber,
    toggle
  },
  props:['element'],
  data() {
    return {
      store:this.$root.store,
      editmode:false,
      remove:false,
      isConnection:this.element.h_type=='connection'
    };
  },
  computed:{
    connectedNodes(){
      let conNodes = null;
      if (this.element.h_type=='connection') {
        conNodes = {};
        let id = this.element.sourceID
        conNodes.source=this.store.sceneList.find((n) => n.h_id==id)
        id = this.element.targetID;
        conNodes.target=this.store.sceneList.find((n) => n.h_id==id)
      }
      return conNodes
    },
    linkDistance:{
      get(){
        return this.element.links[0].distance*2;
      },
      set(newVal){

        const fac=newVal/this.linkDistance;

        //calc new source position
        let newPos = new Vector3(this.connectedNodes.source.x,this.connectedNodes.source.y,this.connectedNodes.source.z)
        let centerPos= new Vector3(this.element.x,this.element.y,this.element.z)
        centerPos.addScaledVector(newPos.sub(centerPos),fac);
        this.connectedNodes.source.x=centerPos.x;
        this.connectedNodes.source.y=centerPos.y;
        this.connectedNodes.source.z=centerPos.z;

        //calc new target position
        newPos = new Vector3(this.connectedNodes.target.x,this.connectedNodes.target.y,this.connectedNodes.target.z)
        centerPos= new Vector3(this.element.x,this.element.y,this.element.z)
        centerPos.addScaledVector(newPos.sub(centerPos),fac);
        this.connectedNodes.target.x=centerPos.x;
        this.connectedNodes.target.y=centerPos.y;
        this.connectedNodes.target.z=centerPos.z;

        this.element.links.forEach((item) => item.distance=newVal/2);
      }
    },
    nodeIsFixed(){
      return this.element.isFixed
    },
    nodeContent(){
      return this.element.content
    },
    selectedObject(){
      return this.store.selectedObject
    }
  },
  watch:{
    nodeIsFixed(newVal){
      if (newVal) {
        this.element.fx=this.element.x;
        this.element.fy=this.element.y;
        this.element.fz=this.element.z;
      }else {
        this.element.fx=null;
        this.element.fy=null;
        this.element.fz=null;
      }
      if(this.element.sceneElement.toolbox) this.element.sceneElement.toolbox.updateField('isFixed',newVal)
    },
    nodeContent(newVal){
      this.element.sceneElement.updateDisplayElement();
    },
    selectedObject(){
      this.editmode=false
      this.remove=false
    }
  },
  methods: {
    log(evt){
      window.console.log(evt);
    },
    removeItem(){
      this.store.sceneList.splice(this.store.sceneList.indexOf(this.element),1);
      this.store.selectedObject=undefined;
    }
  }
};
</script>
<style scoped>
.property-field{
  padding:10px 0;
  margin:0.5em 0;
}

.block{
  border: var(--border);
  cursor:pointer;
}

.links{
  color:blue;
  cursor:pointer;
}

input[type="text"]{
  border-style:dashed;
  padding:10px 0;
  box-sizing:border-box;
  display:inline-block;
  width:100%;
  color:inherit;
  text-align:center
}

.meta{
  text-align:right;
  /* color:var(--gray2); */
  font-size:.6em;
}

.widget-area{
  text-align:center
}

.name:hover{
  text-decoration:underline
}

.button{
  border: 1px solid;
  border-radius: 5px;
  padding:.6em 1em;
}

textarea{
  display:block;
  width:100%;
  box-sizing:border-box;
  resize:vertical;
  height:auto;
  border-style:dashed;
  font-family:inherit;
}

.deleteItem{
  cursor:pointer;
  background-color:rgba(255, 94, 0,.05);
  padding:1px;
  display: block;
  border: 1px solid;
  border-radius:5px;
}

.deleteItem span{
  display:block;
}
.deleteItem:hover{
  background-color:rgba(255, 94, 0,.2);
}
.deleteItem:active{
  background-color:rgba(255, 94, 0,.3);
}

</style>