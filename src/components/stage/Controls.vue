<template>

	<div id="controls_header">
		<div id="help_button" @click="showHelp=!showHelp;showSettings=false ">?</div>
		<div v-if="loggedIn" id="settings_button" title="Settings" @click="showSettings=!showSettings;showHelp=false">Settings</div>
		<div v-if="loggedIn" id="main_button" @click="$emit('toggleEditor')">
			<span id="main_button_text" v-if="!showEditor">Edit</span> <span id="editor_button_indicator" :class="{close_button:showEditor, hide:store.unsavedChanges<1}">{{ store.unsavedChanges }}</span>
		</div>
		<div v-else id="main_button" @click="showSettings=!showSettings">
			<span id="main_button_text">Log in</span>
		</div>
	</div>

	<help-popup v-if="showHelp"/>

	<div id="settings" class="popup login_popup" v-if="showSettings">
		<div class="popup_body">

			<section id="login" v-if="!loggedIn">
				<input type="email" placeholder="Email" :value="email" @focus="store.focused=true" @blur="this.store.focused=false" @keyup="$emit('update:email', $event.target.value)" :class="{ valid: validEmail }" maxlength="255" required/><br><br>
				<div id="password_wrapper">
					<input type="password" placeholder="Password" :value="password" @focus="store.focused=true" @blur="this.store.focused=false" @keyup="$emit('update:password', $event.target.value)" :class="{ valid: password.length>passwordMinLength-1 }" minlength="{{ passwordMinLength }}" maxlength="255" required/>
					<span id="recover_button" @click="$emit('recover')">Forgot?</span>
				</div><br><br>
				<button @click="$emit('login')">Log in</button>
			</section>

			<section id="settings_panel" v-else>
				<h4>Settings</h4>
				<div id="scene_settings">
					<div class="setting colors">
						<span>Polar Helper</span>
						<toggle  off="OFF&nbsp;" on="&nbsp;ON&ensp;" tooltipOff="Show the helper circle in the middle of your scene" tooltipOn="Hide the helper circle in the middle of your scene" :bool="store.sceneSettings.showCircles" v-model="store.sceneSettings.showCircles" :icon="false"/>
					</div>
					<div class="setting colors">
						<span>Background</span>
						<input type="text" class="color" v-model="store.sceneSettings.backgroundColor.bottom" :style="`background-color:${store.sceneSettings.backgroundColor.bottom}` " @focus="store.focused=true" @blur="this.store.focused=false">
						<input type="text" class="color" v-model="store.sceneSettings.backgroundColor.top" :style="`background-color:${store.sceneSettings.backgroundColor.top}`" @focus="store.focused=true" @blur="this.store.focused=false">
					</div>
					<div class="setting colors">
						<span>Globe grid</span>
						<input type="text" class="color" v-model="store.sceneSettings.globeGridColor" :style="`background-color:${store.sceneSettings.globeGridColor}` " @focus="store.focused=true" @blur="this.store.focused=false">
					</div>
				</div>
				<div id="restore" class="mediumgray" @click="store.sceneSettings=JSON.parse(JSON.stringify(store.sceneSettingsDefault))"> restore default</div>
				<div id="logout">
					<span class="bold black">{{ email }}</span><br>
					<span id="logout_button" @click="$emit('logout')">Log out?</span>
				</div>
			</section>
		</div>
	</div>
	<div class="viewport_block" @click="showSettings=showHelp=false" v-if="showSettings || showHelp"></div>

</template>


<script>
import toggle from '@/components/stage/subcomponents/toggle.vue'
import helpPopup from '@/components/stage/subcomponents/help-popup.vue'

export default {
	components: { toggle,helpPopup },
	props: [
		'email',
		'password',
		'loggedIn',
		'showEditor'
	],
	data(){
		return{
			store: this.$root.store,
			showSettings: false,
			showHelp: false,
			validEmail: false,
			passwordMinLength: 8
		}
	},
	methods: {
		validateEmail() {
			(
				( this.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? this.validEmail=true : this.validEmail=false )
			)
		}
	},
	watch: {
		email() {
			this.validateEmail()
		}
	},
	mounted() {
		this.validateEmail()
	},
	emits: [
		'toggleEditor',
		'login',
		'logout',
		'recover',
		'update:email',
		'update:password'
	],
}
</script>


<style>
#login {
	text-align: center;
	font-size: 1rem;
}
#login input {
	width: 14em;
}
#login button {
	padding: 0 1.7em;
}
#password_wrapper {
	display: inline-block;
	position: relative;
}
#recover_button {
	position: absolute;
	right: 1em;
	font-size: .65em;
	cursor: pointer;
	color: var(--main-mediumgray-color);
	line-height: 0;
	top: 50%;
	font-weight: 600;
}
#recover_button:hover {
	color: black;
}
#logout_button {
	cursor: pointer;
	text-decoration: underline;
}
#settings_panel {
	font-size: .8em;
}
#settings_panel h4{
	margin:0;
	margin-bottom:2em;
	font-weight:bold;
	text-align:left;
	color: black;
}
#logout{
	margin-top:2em;
}
.setting{
	margin:1em 0;
}

#restore{
	font-size:.75em;
	cursor:pointer;
	text-decoration:underline;
	text-decoration-style: dotted;
}
.setting.colors{
	display:flex;
	align-items:center;
}
.setting.colors > span{
	padding-right:1em;
}
input.color{
	width: 6em;
	font-weight: 500;
	text-shadow: -1px -1px 0 rgba(255,255,255,.7), 1px -1px 0 rgba(255,255,255,.7), -1px 1px 0 rgba(255,255,255,.7), 1px 1px 0 rgba(255,255,255,.7);
}
input.color:first-of-type{
	margin-right:1em;
}
</style>