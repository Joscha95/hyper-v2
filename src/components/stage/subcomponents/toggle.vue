<template>
  <label class="toggle" :title="bool ? tooltipOn : tooltipOff">
    <input type="checkbox" :checked="bool" @change="$emit('update:modelValue', $event.target.checked)">
    <span class="slider round"><span :class="bool ? '':'active'">{{ off }}</span> <span :class="bool ? 'active':''"> {{ on }}</span></span>
  </label>
</template>

<script>

export default {
  props: ['bool','on','off','tooltipOn','tooltipOff']
};

</script>
<style scoped>
/* The toggle - the box around the slider */
.toggle {
  position: relative;
  display: inline-block;
  width: auto;
  user-select:none;
  vertical-align:top;
  color:inherit;
  height: 100%;
  margin-bottom: 0;
}

/* Hide default HTML checkbox */
.toggle input {
  display:none;
}
/* The slider */
.slider {
  position:relative;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--main-faintgray-color);
  -webkit-transition: .2s;
  transition: .2s;
  overflow:hidden;
  box-sizing:border-box;
  display:block;
  border: 1px solid;
  border-radius: 5px;
  height: 100%;
}

.slider:after {
 position: absolute;
 content: "";
 height: 100%;
 width: 50%;
 left: 0;
 top: 0;
 border-right: 1px solid;
 background-color: white;
 -webkit-transition: .2s;
 transition: .2s;
 z-index:0;
 box-sizing: border-box;
 box-shadow: 0 0 5px rgba(0,0,0,0.5)
}

.slider>span{
  position:relative;
  z-index:1;
  padding:.5em 1em;
  display:inline-block;
  color:rgba(0,0,0,.5);
  box-sizing: content-box;
  font-size: 1.2em;
  text-indent: -.2em;
}
.slider span{
  height: 100%;
}
.slider>span.active{
  color:black;
}

input:checked + .slider {
 /* background-color: #2196F3; */
}

input:checked + .slider:after {
 /* -webkit-transform: translateX(26px);
 -ms-transform: translateX(26px);
 transform: translateX(26px); */
 left:50%;
 border:none;
 border-left: 1px solid;
}
</style>