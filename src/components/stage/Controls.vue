<template>
	<div id="controls_header">
		<div id="help_button">?</div>
		<div v-if="loggedIn" id="settings_button" title="Settings">Settings</div>
		<div v-if="loggedIn" id="main_button" @click="$emit('toggleEditor')">
			<span id="main_button_text">Editor</span> <span id="editor_button_indicator" :class="{close_button:showEditor, hide:store.unsavedChanges<1}">{{ store.unsavedChanges }}</span>
		</div>
		<div v-else id="main_button" @click="$emit('login')">
			<span id="main_button_text">Login</span>
		</div>
	</div>
	<div id="camera_controls" :class="{margin_right:showEditor}">
		<span v-if="loggedIn" @click="$emit('addLookout')">◅ </span>
		<span @click="store.isOrbit=!store.isOrbit">{{store.isOrbit ? '⟴' :'⥁'}}</span>
	</div>
</template>

<!--<input type="password" v-model.trim="password">
<button @click="recover">recover</button>-->

<script>
export default {
	props: [
		'loggedIn', 
		'showEditor'
	],
	data(){
		return{
			store: this.$root.store,
		}
	},
	emits: [
		'toggleEditor', 
		'addLookout',
		'login'
	],
}
</script>