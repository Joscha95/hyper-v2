<template>
  <div id="source">
    <div id="source_header">
      <button id="refresh_button" @click="$emit('update')" title="Refresh blocks"><span class="icon refresh"></span></button>
      <searchbar @search="filterBlocks" title="Search blocks" />
    </div>
    <draggable
      class="drag_list"
      :list="blocks"
      :group="{ name: 'arena-blocks', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneBlock"
      @start="toggleCanvasDragTarget"
      @end="toggleCanvasDragTarget"
      @move="onMove"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="draggable_list_item drag_handle" :class="{no_thumb:!element.image}" v-show="element.title.toLowerCase().includes(searchstring) || (element.content ? element.content.toLowerCase().includes(searchstring) : false)">
          <div class="draggable_list_item_thumb" v-if="element.image">
            <img :src="element.image.thumb.url">
          </div>
          <div class="draggable_list_item_content">
           <span v-if="element.title">{{ element.title }}</span>
           <span v-else-if="element.class=='Text'">{{ element.content }}</span>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/stage/subcomponents/searchbar.vue";
import {makeid} from'@/modules/Helpers.js'

export default {
  order: 3,
  components: {
    draggable,
    searchbar
  },
  props:['blocks'],
  data() {
    return {
      store: this.$root.$data.store,
      lastSelected: null,
      searchstring: ''
    };
  },
  methods: {
    toggleCanvasDragTarget(e){
      switch (e.type) {
        case 'start':
          this.store.isDragging=true
          break;
        case 'end':
          this.store.isDragging=false;
          if(this.lastSelected) this.lastSelected.classList.remove('selected-by-drag')
          this.lastSelected=null;
          break;
        default:
      }
    },
    cloneBlock(item) {
      console.log(item);
      return {
        a_id: item.id,
        h_id: makeid(5),
        name: item.title,
        class: item.class,
        to:[],
        from:[],
        isFixed:false,
        content:item.content_html ? item.content_html : '',
        description: item.description_html,
        imageUrl: item.image ? item.image.thumb.url : '',
        h_type: 'content'
      };
    },
    onMove(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-bydrag')
      this.lastSelected=evt.to;
      this.lastSelected.classList.add('selected-by-drag')
    },
    filterBlocks(e) {
      this.searchstring = e.value ? e.value.toLowerCase().trim() : '';
    }
  }
};
</script>