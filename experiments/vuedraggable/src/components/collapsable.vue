<template>
  <div class="collapse-wrapper">
    <div class="toggleShow" @click="show = !show">
      {{show ? '>' : '<' }}
    </div>
    <div class="content" v-show="show">
      <slot >
      </slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "collapsable",
  order: 3,
  components: {
  },
  data() {
    return {
      show:true
    };
  },
  methods: {

  }
};
</script>
<style>

.collapse-wrapper{
  display:grid;
  grid-template-columns: 20px 100%;
  grid-template-rows: 100%;
  height:100%;
  float:left;
}

.collapse-wrapper > div{
  border:1px solid black;
}
.content{
  width:400px;
}
.list-group{
  min-height:1.5em;
  background-color:rgb(250,250,250)
}
</style>