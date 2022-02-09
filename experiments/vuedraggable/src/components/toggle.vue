<template>
  <label class="toggle">
    <input type="checkbox" :checked="bool" @change="$emit('update:modelValue', $event.target.checked)">
    <span class="slider round"><span :class="bool ? '':'active'">edit scene</span> <span :class="bool ? 'active':''"> add blocks</span></span>
  </label>
</template>

<script>

export default {
  name: "toggle",
  props: ['bool']
};

</script>
<style scoped>
/* The toggle - the box around the slider */
.toggle {
 position: relative;
 display: inline-block;
 width: auto;
 height: 34px;
 user-select:none;
}

/* Hide default HTML checkbox */
.toggle input {
 opacity: 0;
 width: 0;
 height: 0;
}

/* The slider */
.slider {
 position:relative;
 cursor: pointer;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: rgb(240,240,240);
 -webkit-transition: .2s;
 transition: .2s;
 overflow:hidden;
 padding:5px;
 box-sizing:border-box;
 display:block;
 box-shadow: 0 0 1px #2196F3;
}

.slider:after {
 position: absolute;
 content: "";
 height: 100%;
 width: 50%;
 left: 0;
 top: 0;
 background-color: white;
 -webkit-transition: .2s;
 transition: .2s;
 z-index:0;
}

.slider>span{
  position:relative;
  z-index:1;
  margin:1em;
}

input:checked + .slider {
 /* background-color: #2196F3; */
}

input:checked + .slider:after {
 /* -webkit-transform: translateX(26px);
 -ms-transform: translateX(26px);
 transform: translateX(26px); */
 left:50%;
}

/* Rounded sliders */
.slider.round {
 border-radius: 34px;
}

.slider.round:after {
 border-radius: 30px;
}

input:checked + .slider.round:after {
 width:50%;
}
</style>