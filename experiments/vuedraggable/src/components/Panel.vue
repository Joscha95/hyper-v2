<template>
  <collapsable>
    <header>
      <span @click="activeWidget='scene'" :class="activeWidget=='scene' ? 'active' : ''">scene</span>
      <span @click="activeWidget='object'" :class="activeWidget=='object' ? 'active' : ''">object</span>
      <br>
      <br>
    </header>
    <div class="widget-area">
      <Scene v-show="activeWidget=='scene'"/>
      <Inspector v-show="activeWidget=='object'"/>
    </div>
  </collapsable>
</template>

<script>
import collapsable from "./collapsable.vue";
import Scene from './Scene.vue';
import Inspector from './Inspector.vue';
export default {
  name: "Panel",
  order: 3,
  components: {
    collapsable,Scene,Inspector
  },
  data() {
    return {
      activeWidget:'scene'
    };
  },
  methods: {
  }
};
</script>
<style scoped>
  header span{
    margin:.2em;
  }
  .active{
    font-weight:bold;
  }
</style>