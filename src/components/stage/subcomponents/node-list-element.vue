<template>
	<div v-if="editmode" :type="element.h_type">
		<input v-if="h_type=='lookout' " @focus="store.focused=true" @blur="store.focused=false;" v-model="element.name" type="text" placeholder="title">
		<textarea @focus="store.focused=true" @blur="onBlurText" rows="5" v-model="element.content" :placeholder="'say something about the '+h_type"></textarea>
	</div>
	<div v-else @click="store.selectedObject=element" class="drag_handle">
		<div class="draggable_list_item_thumb" v-if="element.imageUrl">
			<img :src="element.imageUrl">
		</div>
		<div class="draggable_list_item_content">
			<span v-if="h_type=='connection'" class="edit_click_area" @click="editmode=!editmode">
				<span v-if="element.content==''" class="icon link"></span>
				{{ element.content }}
			</span>
			<span v-else-if="element.name=='' && h_type=='lookout'" class="edit_click_area" @click="editmode=!editmode">
				<span class="icon lookout"></span>
			</span>
			<span v-else-if="element.name">{{ element.name }}</span>
			<span v-else-if="element.class=='Text'">{{ element.content }}</span>
		</div>
		<span class="icon eye" title="Look at" @click="lookAt($event,element)"></span>
	</div>
	<div class="node_settings" v-if="store.selectedObject==element">
		<div class="connection_properties" v-if="h_type=='connection' ">
			<span class="connection_property_circle" :title="connectedNodes.source.name"></span>
			<draggableNumber :value="linkDistance" v-model="linkDistance"/>
			<span class="connection_property_circle" :title="connectedNodes.target.name"></span>
		</div>
		<div class="node_properties">			
			<toggle v-if="element.h_type!='lookout'" off="dynamic" on="anchor" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="element.isFixed" v-model="element.isFixed" :icon="true"/>
			<div class="delete_button_wrapper" :class="remove ? 'delete' : ''">
				<button v-if="!remove" @click="remove=true" class="delete_button transparent_button" title="Remove?"><span class="icon trash"></span></button>
				<button v-else="" @click="removeItem" class="delete_button transparent_button" title="Sure?"><span class="icon trashopen"></span></button>
			</div>
		</div>
	</div>
</template>

<script>
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'
import {Vector3} from 'three'

export default {
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
      h_type:this.element.h_type
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
    onBlurText(){
      this.store.focused=false;
      this.element.sceneElement.updateDisplayElement();
    },
    removeItem(){
      this.store.sceneList.splice(this.store.sceneList.indexOf(this.element),1);
      this.store.selectedObject=undefined;
    },
    lookAt(e,element){
      window.location.hash=element.h_id;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }
};
</script>