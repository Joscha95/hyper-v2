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

<style lang="css" scoped>
input{
  padding:10px;
  width: 100%;
  margin: .5em 0;
  border-radius:0;
  border:var(--border);
}
</style>
