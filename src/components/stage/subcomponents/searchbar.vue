<template lang="html">
  <input @blur="blur" type="search" v-model="searchstring" placeholder="filter...">
</template>

<script>
export default {
  data(){
    return {
      searchstring:''
    }
  },
  methods:{
    blur(){
      this.searchstring='';
      this.$emit('search',{value:''})
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
