<template>
    <div class="widget-area" v-if="store.selectedObject!=null" >
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
        item-key="h_id"
        style="margin-top:.5em"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.h_id==element.h_id ? 'selected': '' " >
             <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.from=[]" class="delete">×</span>
          </div>
        </template>
      </draggable>

      <i>⇣</i>

      <div v-if="store.selectedObject.h_type=='connection'" :type="store.selectedObject.h_type">
        <input @focus="store.focused=true" @blur="store.focused=false" type="text"  name="" v-model="store.selectedObject.name">
      </div>
      <div v-else>
        {{ store.selectedObject.name }}
      </div>

      <i>⇣</i>

      <draggable
        class="dragArea list-group"
        :list="store.selectedObject.to"
        :class="store.selectedObject.to.length==0 ? 'empty' : ''"
        :removeOnSpill="true"
        @spill="store.selectedObject.to=[]"
        :group="{ name: 'object', pull:'clone', put:true}"
        @change="log"

        @add="addedItem($event,'to')"
        item-key="h_id"
      >
        <template #item="{ element }">
          <div class="list-group-item" :class="store.selectedObject.h_id==element.h_id ? 'selected': '' ">
            <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="store.selectedObject.to=[]" class="delete">×</span>
          </div>
        </template>
      </draggable>

      <div class="property-field">
        <toggle off="↔" on="⥿" tooltipOff="make node fixed" tooltipOn="make node dynamic" :bool="store.selectedObject.isFixed" v-model="store.selectedObject.isFixed"/>
      </div>
      <!-- off="↔" on="⥿"  off="⌱" on="⌖"-->
      <div class="" v-if="store.selectedObject.h_type=='group'">
        <br>
        <br>
        <strong>children</strong><br>
        <br>
        <div  class="list-group-item"
              v-for="(element,index) in store.selectedObject.children"
              :class="store.selectedObject.h_id==element.h_id ? 'selected': '' ">
          <span class="name" @click="store.selectedObject=element">{{ element.name }}</span> <span @click="removeChildFromGroup($event,index)" class="delete">×</span>
        </div>
      </div>

      <div class="" v-if="store.selectedObject.h_type=='connection'">
        <div class="property-field block">
          <span class="name" @click="store.selectedObject=connectedNodes.source">{{ connectedNodes.source.name }}</span>
        </div>
        <i class="rotate">↭</i>
        <div class="property-field block">
          <span class="name" @click="store.selectedObject=connectedNodes.target">{{ connectedNodes.target.name }}</span>
        </div>
        <br>
        <textarea @focus="store.focused=true" @blur="store.focused=false" rows="5" v-model="store.selectedObject.content" placeholder="say something about the connection"></textarea>
        <draggableNumber :value="linkDistance" v-model="linkDistance"/>

      </div>
      <div class="deleteItem delete" @click="removeItem">
        delete
      </div>
      <div class="meta">
        a_id: {{ store.selectedObject.a_id }}<br>
        h_id: {{ store.selectedObject.h_id }}<br>
      </div>
    </div>

    <div v-else>
      No Object selected.
    </div>
</template>

<script>
import draggable from "vuedraggable";
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
import toggle from '@/components/stage/subcomponents/toggle.vue'
import {Vector3} from 'three'

let idGlobal = 8;
export default {
  name: "Inspector",
  order: 3,
  components: {
    draggable,
    draggableNumber,
    toggle
  },
  data() {
    return {
      store:this.$root.store
    };
  },
  computed:{
    connectedNodes(){
      let conNodes = null;
      if (this.store.selectedObject.h_type=='connection') {
        conNodes = {};
        let id = this.store.selectedObject.sourceID
        conNodes.source=this.store.sceneList.find((n) => n.h_id==id)
        id = this.store.selectedObject.targetID;
        conNodes.target=this.store.sceneList.find((n) => n.h_id==id)
      }
      return conNodes
    },
    linkDistance:{
      get(){
        return this.store.selectedObject.links[0].distance*2;
      },
      set(newVal){

        const fac=newVal/this.linkDistance;

        //calc new source position
        let newPos = new Vector3(this.connectedNodes.source.x,this.connectedNodes.source.y,this.connectedNodes.source.z)
        let centerPos= new Vector3(this.store.selectedObject.x,this.store.selectedObject.y,this.store.selectedObject.z)
        centerPos.addScaledVector(newPos.sub(centerPos),fac);
        this.connectedNodes.source.x=centerPos.x;
        this.connectedNodes.source.y=centerPos.y;
        this.connectedNodes.source.z=centerPos.z;

        //calc new target position
        newPos = new Vector3(this.connectedNodes.target.x,this.connectedNodes.target.y,this.connectedNodes.target.z)
        centerPos= new Vector3(this.store.selectedObject.x,this.store.selectedObject.y,this.store.selectedObject.z)
        centerPos.addScaledVector(newPos.sub(centerPos),fac);
        this.connectedNodes.target.x=centerPos.x;
        this.connectedNodes.target.y=centerPos.y;
        this.connectedNodes.target.z=centerPos.z;

        this.store.selectedObject.links.forEach((item) => item.distance=newVal/2);
      }
    },
    nodeIsFixed(){
      return this.store.selectedObject ? this.store.selectedObject.isFixed : false
    },
    nodeContent(){
      return this.store.selectedObject ? this.store.selectedObject.content : '-'
    }
  },
  watch:{
    nodeIsFixed(newVal){
      if (!this.store.selectedObject) return;
      if (newVal) {
        this.store.selectedObject.fx=this.store.selectedObject.x;
        this.store.selectedObject.fy=this.store.selectedObject.y;
        this.store.selectedObject.fz=this.store.selectedObject.z;
      }else {
        this.store.selectedObject.fx=null;
        this.store.selectedObject.fy=null;
        this.store.selectedObject.fz=null;
      }
      this.store.selectedObject.sceneElement.toolbox.updateField('isFixed',newVal)
    },
    nodeContent(newVal){
      if (!this.store.selectedObject) return;
      this.store.selectedObject.sceneElement.setContent(newVal)
    }
  },
  methods: {
    log(evt){
      window.console.log(evt);
    },
    addedItem(evt,list){
      const ele = this.store.selectedObject[list][evt.newIndex];
      this.store.selectedObject[list]=[ele];
    },
    removeItem(){
      this.store.sceneList.splice(this.store.sceneList.indexOf(this.store.selectedObject),1);
      this.store.selectedObject=undefined;
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
  content:'chaining';
  color:var(--gray2);
  padding:10px;
  display:block;
}

.selected-by-drag.list-group.empty:after{
  display:none;
}

.property-field{
  padding:10px 0;
  margin:0.5em 0;
}

.block{
  border: var(--border);
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

.sortable-chosen,
.sortable-ghost{
  color:var(--main-error-color);
}

.meta{
  text-align:right;
  /* color:var(--gray2); */
  font-size:.6em;
}


i{
  display: inline-block;
  font-style:normal;
  margin:1em 0;
}

i.rotate{
  transform:rotate(-90deg);
  color:blue;
  margin:.5em 0 ;
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
  border-style:dashed;
  font-family:inherit;
}

.deleteItem{
  cursor:pointer;
  background-color:rgba(255, 94, 0,.05);
  padding:.5em;
  display:inline-block;
  border: 1px solid;
  border-radius:5px;
}
.deleteItem:hover{
  background-color:rgba(255, 94, 0,.2);
}
.deleteItem:active{
  background-color:rgba(255, 94, 0,.3);
}

</style>