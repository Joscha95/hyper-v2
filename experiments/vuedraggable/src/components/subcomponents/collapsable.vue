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
  border-radius:20px 0 0 20px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  padding:10px;
  box-sizing: border-box;
  background-color:white;
}

.toggleShow{
  font-weight:900;
  font-size: .9em;
  cursor:pointer;
}

.content{
  width:40vw;
}

</style>