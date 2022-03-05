<template>

	<div id="controls_header">
		<div id="help_button">?</div>
		<div v-if="loggedIn" id="settings_button" title="Settings">Settings</div>
		<div v-if="loggedIn" id="main_button" @click="$emit('toggleEditor')">
			<span id="main_button_text">Editor</span> <span id="editor_button_indicator" :class="{close_button:showEditor, hide:store.unsavedChanges<1}">{{ store.unsavedChanges }}</span>
		</div>
		<div v-else id="main_button" @click="showSettings=!showSettings">
			<span id="main_button_text">Login</span>
		</div>
	</div>

	<div id="camera_controls" :class="{margin_right:showEditor}">
		<span v-if="loggedIn" @click="$emit('addLookout')">⩥ </span>
		<span @click="store.isOrbit=!store.isOrbit">{{store.isOrbit ? '⟴' :'⥁'}}</span>
	</div>

	<div id="settings" class="popup" v-if="showSettings">
		<div class="popup_body">
			<input type="password" :value="password" @focus="store.focused=true" @blur="this.store.focused=false" @keyup="$emit('update:password', $event.target.value)"  >
			<p @click="$emit('login')">Login</p>
			<p @click="$emit('logout')">Logout</p>
			<p @click="$emit('recover')">Forgot password?</p>
		</div>
		<div class="popup_close_button" @click="showSettings=false">close</div>
	</div>

</template>


<script>
export default {
	props: [
		'loggedIn',
		'password',
		'showEditor'
	],
	data(){
		return{
			store: this.$root.store,
			showSettings: false
		}
	},
	emits: [
		'toggleEditor',
		'addLookout',
		'login',
		'logout',
		'recover',
		'update:password'
	],
}
</script>