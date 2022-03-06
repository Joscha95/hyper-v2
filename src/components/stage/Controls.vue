<template>

	<div id="controls_header">
		<div id="help_button">?</div>
		<div v-if="loggedIn" id="settings_button" title="Settings" @click="showSettings=!showSettings">Settings</div>
		<div v-if="loggedIn" id="main_button" @click="$emit('toggleEditor')">
			<span id="main_button_text">Editor</span> <span id="editor_button_indicator" :class="{close_button:showEditor, hide:store.unsavedChanges<1}">{{ store.unsavedChanges }}</span>
		</div>
		<div v-else id="main_button" @click="showSettings=!showSettings">
			<span id="main_button_text">Log in</span>
		</div>
	</div>

	<div id="camera_controls" :class="{margin_right:showEditor}">
		<span v-if="loggedIn" @click="$emit('addLookout')">⩥ </span>
		<span @click="store.isOrbit=!store.isOrbit">{{store.isOrbit ? '⟴' :'⥁'}}</span>
	</div>

	<div id="settings" class="popup" v-if="showSettings">
		<div class="popup_body">
			<section id="user_credentials" >
				<input type="email" placeholder="Email" :value="email" @focus="store.focused=true" @blur="this.store.focused=false" @keyup="$emit('update:email', $event.target.value)" :class="{ valid: validEmail }" maxlength="255" required/>
				<div id="password_wrapper">
					<input type="password" placeholder="Password" :value="password" @focus="store.focused=true" @blur="this.store.focused=false" @keyup="$emit('update:password', $event.target.value)" :class="{ valid: password.length>passwordMinLength-1 }" minlength="{{ passwordMinLength }}" maxlength="255" required/>
					<span id="recover_button" @click="$emit('recover')">Forgot?</span>
				</div>
				<button v-if="!loggedIn" @click="$emit('login')">Log in</button>
				<button v-if="loggedIn" @click="$emit('logout')">Log out</button>
			</section>
		</div>

		<div class="popup_close_button" @click="showSettings=false">close</div>
	</div>

</template>


<script>
export default {
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
		'addLookout',
		'login',
		'logout',
		'recover',
		'update:email',
		'update:password'
	],
}
</script>


<style>
#user_credentials {
	display: flex;
	flex-wrap: nowrap;
}
#user_credentials input {
	margin-right: .5em;
}
#password_wrapper {
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

</style>