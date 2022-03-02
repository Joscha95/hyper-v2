<template>
  <div id="all_blocks">
    <div id="all_blocks_header">
      <strong @click="show=!show" id="add_block_button">add blocks</strong>
      <searchbar v-show="show" @search="filterBlocks" />
    </div>
    <div id="all_blocks_body" v-show="show">
      <draggable
        class="dragArea list_group"
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
          <div class="draggable_list_item" v-show="element.title.toLowerCase().includes(searchstring)">
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
  </div>
</template>

<script>
import draggable from "vuedraggable";
import searchbar from "@/components/stage/subcomponents/searchbar.vue";
import {makeid} from'@/modules/Helpers.js'

let idGlobal = 8;
export default {
  order: 3,
  components: {
    draggable,
    searchbar
  },
  props:['blocks'],
  data() {
    return {
      store:this.$root.$data.store,
      lastSelected:null,
      searchstring:'',
      show:true
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
      return {
        a_id: item.id,
        h_id: makeid(5),
        name: item.title,
        class: item.class,
        to:[],
        from:[],
        isFixed:false,
        content:item.content,
        imageUrl:item.image.thumb.url,
        h_type: 'content'
      };
    },
    onMove(evt){
      if(this.lastSelected) this.lastSelected.classList.remove('selected-bydrag')
      this.lastSelected=evt.to;
      this.lastSelected.classList.add('selected-by-drag')
    },
    filterBlocks(e){
      this.searchstring=e.value.toLowerCase()
    }
  }
};
</script>