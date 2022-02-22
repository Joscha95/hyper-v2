<template>
    <div class="widget-area" v-if="store.selectedObject" >
      <strong>object</strong><br>
      <draggable
        class="dragArea list-group"
        :class="store.selectedObject.from.length==0 ? 'empty' : ''"
        :list="store.selectedObject.from "
        :group="{ name: 'object', pull:'clone', put:true}"
        :sort="false"
        @change="log"
        @add="addedItem($event,'from')"
        :removeOnSpill="true"
        @spill="store.selectedObject.from=[]"
        item-key="h_uuid"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.h_uuid==element.h_uuid ? 'selected': '' " >
             <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.from=[]">x</span>
          </div>
        </template>
      </draggable>
      <i>&darr;</i>

      <div v-if="store.selectedObject.h_type=='connection'">
        <input type="text"  name="" v-model="store.selectedObject.name">
      </div>
      <div v-else>
        {{ store.selectedObject.name }}
      </div>

      <i>&darr;</i>
      <draggable
        class="dragArea list-group"
        :list="store.selectedObject.to"
        :class="store.selectedObject.to.length==0 ? 'empty' : ''"
        :removeOnSpill="true"
        @spill="store.selectedObject.to=[]"
        :group="{ name: 'object', pull:'clone', put:true}"
        @change="log"

        @add="addedItem($event,'to')"
        item-key="h_uuid"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.h_uuid==element.h_uuid ? 'selected': '' ">
            <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.to=[]">x</span>
          </div>
        </template>
      </draggable>
      <br>
      <div class="meta">
        id: {{ store.selectedObject.id }}<br>
        h_uuid: {{ store.selectedObject.h_uuid }}<br>
      </div>

      <div class="" v-if="store.selectedObject.h_type=='group'">
        <br>
        <br>
        <strong>children</strong><br>
        <br>
        <div  class="list-group-item"
              v-for="(element,index) in store.selectedObject.children"
              :class="store.selectedObject.h_uuid==element.h_uuid ? 'selected': '' ">
          <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="removeChildFromGroup($event,index)">x</span>
        </div>
      </div>

      <div class="" v-if="store.selectedObject.h_type=='connection'">
        <br>
        <br>
        <strong>text</strong><br>
        <br>
        <textarea rows="5" v-model="store.selectedObject.text" placeholder="say something about the connection"></textarea>
      </div>
    </div>

    <div v-else>
      No Object selected.
    </div>
</template>

<script>
import draggable from "vuedraggable";

let idGlobal = 8;
export default {
  name: "Inspector",
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      store:this.$root.store
    };
  },
  methods: {
    log(evt){
      window.console.log(evt);
    },
    addedItem(evt,list){
      const ele = this.store.selectedObject[list][evt.newIndex];
      this.store.selectedObject[list]=[ele];
    },
    removeChildFromGroup(evt,index){
      this.store.sceneList.push(
        this.store.selectedObject.children.splice(index,1)[0]
      )
    }
  }
};
</script>
<style scoped>
.list-group-item{
  cursor:pointer;
}

.selected-by-drag .list-group-item:not(.sortable-chosen){
  display:none;
}

.list-group.empty{
  border: var(--border);
  background-color:white;
}

.list-group.empty:after{
  content:'drag block here';
  color:var(--gray2);
  padding:10px;
  display:block;
}

.selected-by-drag.list-group.empty:after{
  display:none;
}

input{
  border-style:dashed;
  padding:10px 0 10px 10px;
  box-sizing:border-box;
  display:inline-block;
  width:100%;
}

.sortable-chosen,
.sortable-ghost{
  color:red;
}

.meta{
  text-align:right;
  /* color:var(--gray2); */
  font-size:.6em;
}


i{
  display: inline-block;
  margin:1em 0;
}

.widget-area{
  text-align:center
}

.name:hover{
  text-decoration:underline
}

textarea{
  display:block;
  width:100%;
  box-sizing:border-box;
  resize:vertical;
  height:auto;
}

</style>