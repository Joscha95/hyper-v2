<template>
	<div id="editor_controls">
		<div id="settings_button" title="Settings">⚙</div>
		<div id="editor_button" @click="show=!show">
			Editor
			<span id="editor_button_indicator" :class="{close_button:show, all_clear:store.unsavedChanges==0}">
				{{ store.unsavedChanges }}
			</span>
		</div>
	</div>
	<div id="editor" v-if="show" :class="{opened:show}">
		<div id="editor_inner">
			<div class="list_controls">
				<searchbar @search="filterBlocks" />
				<button class="list_controls_button" @click="$emit('save')">save</button>
			</div>
			<draggable
			class="dragArea editor_list"
			:list="store.sceneList"
			:group="{ name: 'object',pull:onPull,put:true}"
			@move="onMove"
			@end="onEnd"
			@change="onChange"
			handle=".drag_handle"
			animation="50"
			item-key="h_id"
			>
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
	</div>
	<div id="camera_toggle" @click="store.isOrbit=!store.isOrbit">
    {{store.isOrbit ? '⟴' :'⥁'}}
  </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/stage/subcomponents/searchbar.vue";
import nodeListElement from "@/components/stage/subcomponents/node-list-element.vue";

let idGlobal = 8;
export default {
	data(){
		return{
			store: this.$root.store,
			searchstring: '',
			lastSelected: null,
			show: true
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