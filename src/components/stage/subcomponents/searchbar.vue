<template lang="html">
  <input @focus="store.focused=true" @blur="this.store.focused=false" type="search" v-model="searchstring" placeholder="filter...">
</template>

<script>
export default {
  data(){
    return {
      searchstring:'',
      store:this.$root.store
    }
  },
  watch:{
    searchstring(){
      this.$emit('search',{value:this.searchstring})
    }
  }
}
</script>

<style scoped>
input{
  padding:10px;
  width: 100%;
  border-radius:0;
  border:var(--border);
  margin: 0;
}
</style>
