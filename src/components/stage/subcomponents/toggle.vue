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
.toggle {
	position: relative;
	display: inline-block;
	width: auto;
	user-select: none;
	vertical-align: top;
	color: inherit;
}
.toggle input {
	display: none;
}
.slider {
	position: relative;
	cursor: pointer;
	background-color: var(--main-faintgray-color);
	transition: .2s;
	overflow: hidden;
	box-sizing: border-box;
	display: block;
	border: 1px solid;
	border-radius: 5px;
	height: 100%;
}
.slider:after {
	position: absolute;
	content: '';
	height: 100%;
	width: 50%;
	left: 0;
	top: 0;
	border-right: 1px solid;
	background-color: white;
	transition: left .2s;
	z-index: 0;
	box-sizing: border-box;
	box-shadow: 0 0 5px rgba(0,0,0,0.5)
}
.slider>span{
	position: relative;
	z-index: 1;
	padding: .5em 1em;
	display: inline-block;
	color: rgba(0,0,0,.5);
	font-size: 1.2em;
	margin-right: -1px;
	box-sizing: content-box;
}
.slider span{
	height: 100%;
}
.slider>span.active{
	color: black;
}
input:checked + .slider:after {
	left: 50%;
	border: none;
	border-left: 1px solid;
}
</style>