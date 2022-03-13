<template>

	<div id="controls_header">
		<div id="help_button">?</div>
		<div v-if="loggedIn" id="settings_button" title="Settings" @click="showSettings=!showSettings">Settings</div>
		<div v-if="loggedIn" id="main_button" @click="$emit('toggleEditor')">
			<span id="main_button_text">Edit</span> <span id="editor_button_indicator" :class="{close_button:showEditor, hide:store.unsavedChanges<1}">{{ store.unsavedChanges }}</span>
		</div>
		<div v-else id="main_button" @click="showSettings=!showSettings">
			<span id="main_button_text">Log in</span>
		</div>
	</div>

	<div id="settings" class="popup" v-if="showSettings">
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
				<span class="bold">Settings</span>
				<span id="restore" @click="store.sceneSettings=JSON.parse(JSON.stringify(store.sceneSettingsDefault))"> restore default</span>
				<div id="scene_settings">
					<div class="setting colors">
						<span>Polar Helper</span>
						<toggle  off="OFF&nbsp;" on="&nbsp;ON&nbsp;" tooltipOff="Show the helper circle in the middle of your scene" tooltipOn="Hide the helper circle in the middle of your scene" :bool="store.sceneSettings.showCircles" v-model="store.sceneSettings.showCircles" :icon="false"/>
					</div>
					<div class="setting colors">
						<span>Background</span>
						<input type="text" class="color" v-model="store.sceneSettings.backgroundColor.bottom" :style="`background-color:${store.sceneSettings.backgroundColor.bottom}` " @focus="store.focused=true" @blur="this.store.focused=false">
						<input type="text" class="color" v-model="store.sceneSettings.backgroundColor.top" :style="`background-color:${store.sceneSettings.backgroundColor.top}`" @focus="store.focused=true" @blur="this.store.focused=false">
					</div>
				</div>
				<div id="logout">
					Logged in as <span class="bold black">{{ email }}</span>.&emsp;<span id="logout_button" @click="$emit('logout')">Log out?</span>
				</div>
			</section>
		</div>
	</div>
	<div class="viewport_block" @click="showSettings=false" v-if="showSettings"></div>

</template>


<script>
import toggle from '@/components/stage/subcomponents/toggle.vue'

export default {
	components: { toggle },
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
#password_wrapper {
	display: inline-block;
	position: relative;
}
#recover_button {
	position: absolute;
	right: 1.4em;
	font-size: .7em;
	cursor: pointer;
	color: var(--main-mediumgray-color);
	line-height: 0;
	top: 49%;
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
	margin-bottom:1em;
	font-weight:bold;
	text-align:center
}
#logout{
	margin-top:3em;
}
.setting{
	margin:1em 0;
}

#restore{
	font-size:.75em;
	cursor:pointer;
	float:right;
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
}
input.color:first-of-type{
	margin-right:1em;
}
</style>