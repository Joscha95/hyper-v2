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
			<span v-if="h_type=='lookout' || h_type=='connection'" class="edit_click_area" @click="editmode=!editmode">
				<span :class="'icon '+h_type"></span>
				{{ h_type=='connection' ? element.content : element.name }}
			</span>
			<span v-else>
				{{ element.class=='Text' ? element.content : element.name }}
			</span>
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
import {sceneElements, forceSimulation} from '@/store.js'

export default {
  components: {
    draggableNumber,
    toggle
  },
  props:['element'],
  data() {
		this.sceneElement = sceneElements.find((e) => e.h_id == this.element.h_id);
		this.forceElement = forceSimulation.getNodeById(this.element.h_id);

    return {
      store:this.$root.store,
      editmode:false,
      remove:false,
      h_type:this.element.h_type,
      h_id:this.element.h_id,
			linkDistance: this.forceElement && this.forceElement.links ? this.forceElement.links[0].distance*2 : 0
    };
  },
  computed:{
    connectedNodes(){
      let conNodes = null;
      if (this.h_type=='connection') {
        conNodes = {};
        let id = this.element.sourceID
        conNodes.source=this.store.sceneList.find((n) => n.h_id==id)
        id = this.element.targetID;
        conNodes.target=this.store.sceneList.find((n) => n.h_id==id)
      }
      return conNodes
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
				forceSimulation.setNodeFixed(this.h_id)
      }else {
				forceSimulation.setNodeDynamic(this.h_id)
      }
			const sl = this.sceneElement;
      if(sl.toolbox) sl.toolbox.updateField('isFixed',newVal)
    },
    nodeContent(newVal){
      this.sceneElement.updateDisplayElement();
    },
    selectedObject(){
      this.editmode=false
      this.remove=false
    },
		linkDistance(newVal,oldVal){
			forceSimulation.setLinkLength(this.h_id,newVal,newVal/oldVal)
		}
  },
  methods: {
		getSimulationElement(id=this.element.h_id){
			return simulation_positions.find( n => n.h_id==id);
		},
    onBlurText(){
      this.store.focused=false;
      this.sceneElement.updateDisplayElement();
    },
    removeItem(){
      this.store.sceneList.splice(this.store.sceneList.findIndex((el) => el.h_id==this.h_id),1);
			forceSimulation.removeNode(this.h_id)
			this.store.unsavedChanges++;
      this.store.selectedObject=undefined;
    },
    lookAt(e,element){
      window.location.hash=element.h_id;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }
};
</script>