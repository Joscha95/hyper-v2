<template>
	<div id="editor">
		<div id="editor_header">
			<div id="save_button_wrapper">
				<span id="save_button_changes" v-if="store.unsavedChanges>0"><strong class="err_col">{{ store.unsavedChanges }}</strong> unsaved change<span v-if="store.unsavedChanges>1">s</span></span>
				<button id="save_button" @click="$emit('save')">save</button>
			</div>
			<searchbar @search="filterBlocks" />
		</div>
		<draggable
		class="drag_list editor_list"
		:list="store.sceneList"
		:group="{ name: 'object',pull:onPull,put:true}"
		@move="onMove"
		@end="onEnd"
		@change="onChange"
		handle=".drag_handle"
		animation="50"
		item-key="h_id">
			<template #item="{ element }">
				<div class="draggable_list_item"
				:class="selectedObjectId==element.h_id ? 'selected': '' "
				:type="element.h_type" v-if="element.name.toLowerCase().includes(searchstring) || element.content.toLowerCase().includes(searchstring) "
				@dblclick="onDoubleClick($event,element)"
				>
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

export default {
	data(){
		return{
			store: this.$root.store,
			searchstring: '',
			lastSelected: null
		}
	},
	emits: ['save'],
	components:{ searchbar, draggable, nodeListElement },
	computed:{
		selectedObjectId(){
			return this.store.selectedObject ? this.store.selectedObject.h_id : ''
		}
	},
	methods:{
		filterBlocks(e){
			this.searchstring=e.value
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