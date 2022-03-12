<template lang="html">
  <input @focus="store.focused=true" @blur="this.store.focused=false" type="search" v-model.trim="searchstring" placeholder="⌕" class="searchbar">
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
  .searchbar {
    width: 100%;
  }
</style>