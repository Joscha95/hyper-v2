<template>
  <div class="number_handle" @mousedown="mousedown" title="drag to change length of connection">
    <span class="number_handle_value">{{ Math.round(_value) }}</span>
  </div>
</template>

<script>
export default {
  props:['value'],
  data(){
    return {
      _value:this.value
    }
  },
  methods: {
    mousedown(e){
      let oldY=e.clientY;
      let fac=1;
      document.onmousemove=(em)=>{
        fac = em.shiftKey ? 10 : em.altKey ? .1 : 1;
        this._value+=(oldY-em.clientY)*fac;
        this._value=Math.max(this._value,10);
        oldY=em.clientY;
        this.$emit('update:modelValue', this._value);
      }
      document.onmouseup=()=>{
        document.onmousemove=null;
      }
    }
  },
  watch:{
    value(newVal){
      this._value=newVal;
    }
  }
}
</script>