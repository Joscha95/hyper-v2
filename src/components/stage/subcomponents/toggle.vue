<template>
	<label class="toggle" :title="bool ? tooltipOn : tooltipOff" :class="{iconToggle:icon}">
		<input type="checkbox" :checked="bool" @change="$emit('update:modelValue', $event.target.checked)">
		<span class="slider round">
			<span :class="bool ? '':'active'">
				<span v-if="icon" :class="[icon ? off : '', 'icon']"></span>
				<span v-else>{{ off }}</span>
			</span>
			<span :class="bool ? 'active':''">
				<span v-if="icon" :class="[icon ? on : '', 'icon']"></span>
				<span v-else>{{ on }}</span>
			</span>
		</span>
	</label>
</template>

<script>
export default {
	props: ['bool','on','off','tooltipOn','tooltipOff','icon']
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
	margin-bottom: 0;
	font-weight: 400;
}
.iconToggle {
	line-height: 0;
}
.toggle input {
	display: none;
}
.slider {
	position: relative;
	cursor: pointer;
	background-color: var(--main-faintgray-color);
	overflow: hidden;
	box-sizing: border-box;
	display: block;
	border: 1px solid;
	border-radius: 5px;
	height: 100%;
	border-color: var(--main-gray-color);
}
.slider:hover {
	border-color: black;
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
	box-shadow: 0 0 5px rgba(0,0,0,0.5);
	border-right: 1px solid var(--main-gray-color);
}
.slider:hover:after, input:checked + .slider:hover:after {
	border-color: black;
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
.slider span:not(.icon) {
	height: 100%;
}
.iconToggle .slider span:not(.icon) {
	padding: .7em 1em;
}
.slider>span.active{
	color: black;
}
input:checked + .slider:after {
	left: 50%;
	border-right: 0;
	border-left: 1px solid var(--main-gray-color);
}
</style>