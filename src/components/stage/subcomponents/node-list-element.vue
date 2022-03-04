<template>
      <div v-if="isConnection && editmode" :type="element.h_type">
        <textarea @focus="store.focused=true" @blur="store.focused=false" rows="5" v-model="element.content" placeholder="say something about the connection"></textarea>
      </div>
      <div v-else @click="store.selectedObject=element" class="drag_handle">
          <div class="draggable_list_item_thumb" v-if="element.imageUrl">
            <img :src="element.imageUrl">
          </div>
          <div class="draggable_list_item_content">
            <span v-if="isConnection">{{ element.content }}</span>
           <span v-else-if="element.name">{{ element.name }}</span>
           <span v-else-if="element.class=='Text'">{{ element.content }}</span>
          </div>
      </div>

      <div v-if="store.selectedObject==element">
        <div class="node_properties" >
          <toggle v-if="element.h_type!='lookout'" off="↔" on="⥿" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="element.isFixed" v-model="element.isFixed"/>
          <button v-if="isConnection" @click="editmode=!editmode" class="transparent_button">{{ editmode ? 'done' :'edit' }}</button>
        </div>

        <div class="connection_properties" v-if="isConnection">
          <span class="connection_property_circle" @click="element=connectedNodes.source" :title="connectedNodes.source.name"></span>
          <draggableNumber :value="linkDistance" v-model="linkDistance"/>
          <span class="connection_property_circle" @click="element=connectedNodes.target" :title="connectedNodes.target.name"></span>
        </div>

        <div class="delete_button_wrapper" :class="remove ? 'delete' : ''">
          <button v-if="!remove" @click="remove=true" class="delete_button transparent_button">remove</button>
          <button v-else="" @click="removeItem" class="delete_button transparent_button">sure?</button>
        </div>

      </div>

</template>

<script>
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'
import {Vector3} from 'three'

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

input[type="text"]{
  border-style:dashed;
  padding:10px 0;
  box-sizing:border-box;
  display:inline-block;
  width:100%;
  color:inherit;
  text-align:center
}

textarea{
  display:block;
  width:100%;
  box-sizing:border-box;
  resize:vertical;
  height:auto;
  border-style:dashed;
  font-family:inherit;
  margin-bottom: 1rem;
}

</style>