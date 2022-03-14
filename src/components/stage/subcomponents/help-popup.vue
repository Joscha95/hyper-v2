<template>
	<div id="help" class="popup">
		<div class="popup_body">

			<h3>Help</h3>

				<!--<span class="icon arrows"></span>-->
				<div class="helpsection cheatsheet">
					<div class="iconset table">
						<!-- <u>Toolbar</u> <br> -->
						<span class="icon eye"></span> <span>focus element </span>
						<span class="icon move"></span> <span> move element</span>
						<span class="icon connect"></span> <span> begin connection</span>
						<span class="icon dynamic"></span> <span>node is dynamic </span>
						<span class="icon anchor"></span> <span>node is fixed <span class="more_info_container"><span class="more_info_qmark">?</span> <span class="more_info_content">A click here makes the node <u>dynamic</u> and with that affected by repulsive forces of other nodes around it.</span> </span> </span>
						<span class="icon thread"></span> <span> start a thread <span class="more_info_container"><span class="more_info_qmark">?</span> <span class="more_info_content">A thread can be seen as a guideline for any visitor of your hyperspace. You can have only one thread.<br>Clicking this button will start your thread at the selected node.</span> </span></span>
						<span class="icon threadstart"></span> <span>continue thread </span>
						<span class="icon threaddelete"></span> <span>remove node from thread </span>
					</div>

					<div class="buttons table">
						<!-- <u>Edit</u><br> -->
						<div class="connection_properties_wrapper">
							<div class="connection_properties help">
						  	<a class="connection_property_circle" ></a>
						  	<draggableNumber :value="512" />
						  	<a class="connection_property_circle" ></a>
							</div>
						</div>
						<span>focus connected/change length</span>

						<toggle class="camtogglehelp" id="camera_toggle" off="firstperson" on="orbit" tooltipOff="First person camera" tooltipOn="Orbit camera" :bool="false" :icon="true"/>
						<span>toggle camera mode</span>

						<span class="icon threadinsert"></span> <span> insert node in thread</span>
					</div>

					<div class="keyboard table">
						<span><span class="key">←</span> <span class="key">→</span> </span> <span>go back/forward</span>
						<span><span class="key">o</span>  </span> <span>toggle camera mode</span>
						<span><span class="key">cmd</span>+<span class="key">s</span></span> <span>save</span>
					</div>
				</div>
				<h3 class="showmorebtn" @click="showMore=!showMore">More details <span>{{ showMore ? '-' : '+' }}</span> </h3>
				<section class="helpsections" v-if="showMore">
					<div class="helpsection">
						<u>Lookouts</u> <span class="icon lookout"></span> <br>
						On the bottom right fo your screen you can add a lookout with this button:
						<div id="lookout_btn" class="lookout_btn" >
							<span >Add</span>
							<span class="icon lookout"/>
						</div>. If you have entered a Lookout (by clicking the eye icon <span class="icon eye"/>) you can lock it to the camera position and rotation by entering the transform mode:
						<div id="lookout_btn" class="transform lookout_btn" >
							<span>Move</span>
							<span class="icon lookout"/>
						</div>
					</div>

					<div class="helpsection">
						<u>Camera</u><br>
						There two camera modes:  First person (<span class="icon firstperson"/>) and orbit mode (<span class="icon orbit"/>).<br> You can toggle between them by clicking this switch on the lower right of your screen: <toggle id="camera_toggle" off="firstperson" on="orbit" tooltipOff="First person camera" tooltipOn="Orbit camera" :bool="false" :icon="true"/> or by pressing "o" on your keyboard.
					</div>

					<div class="helpsection">
						<u>Connections</u><br>
						Connections (<span class="icon link"/>) can be enriched by a description in the <span class="editor_button">Edit</span>-Panel. If the connected nodes are dynamic (<span class="icon dynamic"/>) the connection acts as a force that keeps them sticking together.<br>You can change the distance by dragging the number in the Editor vertically:
						<div class="connection_properties_wrapper">
							<div class="connection_properties help">
								<a class="connection_property_circle" ></a>
								<draggableNumber :value="512" />
								<a class="connection_property_circle" ></a>
							</div>
						</div>. The round dots will focus the connected Nodes in your view.
					</div >

					<div class="helpsection">
						<u>Thread</u><br>
						The thread guides visitor through your scene. If a Node is in focus, which is also part of the thread the navigator will appear in the bottom of your screen. With the arrows (<span class="icon threadprev"/> and <span class="icon threadnext"/>) you can navigate to the previous/next Node.<br>Hovering over the thread will let you <span class="icon threadinsert"/> insert a node in your thread. <br>
					</div>
				</section>


		</div>
	</div>
</template>

<script>
import toggle from '@/components/stage/subcomponents/toggle.vue'
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
export default {
	data(){
		return{
			showMore:false
		}
	},
	components:{
    toggle,
		draggableNumber
  },
};
</script>
<style scoped>
#help{
	max-height:70%;
	overflow-y:auto;
}

.helpsection{
	margin:1em 0;
}

.cheatsheet{
	display:flex;
	flex-wrap: wrap;
	align-items:flex-start;
  align-content:flex-start;
}


	.more_info_container{
		position:relative;
		cursor:pointer;
	}
	.more_info_content{
		position:absolute;
		background-color:white;
		border:1px solid black;
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.15);
		z-index:1;
		left:1em;
		padding:.5em;
		margin-left:.3em;
		transform:translateY(-7%);
		display:none;
		min-width:20vw;
	}
	.more_info_qmark{
		font-weight:normal;
		margin-left:.2em;
		font-size:.8rem;
	}
	.more_info_container:hover .more_info_qmark{
		text-decoration:underline;
		text-decoration-style:dotted;
	}
	.more_info_container:hover	.more_info_content{
		display:block;
	}
	.icon.threadinsert{
		background-color:var(--main-thread-color);
		border-radius:100%;
		padding:.4em;
		background-size: 60%;
	}

	.lookout_btn{
		display:inline-block !important;
		line-height:2.4;
		margin-right:0 !important;
	}



	.editor_button {
    background: white;
    padding: 0 0.9rem;
		padding-top:.1rem;
    color: black;
    border-radius: 2rem;
    position: relative;
    cursor: pointer;
    display: inline-block;
    align-items: center;
    height: 2rem;
    box-sizing: border-box;
    border: 1px solid var(--main-gray-color);
}

	.margin {
    margin-right: 1em;
	}

	.buttons .margin{
		margin: 0 1em 1em 0;
	}

	.toggle span{
		margin-right:0;
	}



	.connection_properties_wrapper{
		display:inline-block
	}

	.connection_properties.help{
		margin:0;
	}

	.table{
		display:grid;
		grid-template-columns: auto auto;
		column-gap: 1em;
		row-gap:.5em;
	}

	.table >*:nth-of-type(2n-3){
		justify-self: end;
	}

	/* .keyboard.table >*{
		justify-self: unset;
	}

	.keyboard.table >*:nth-of-type(2n){
		justify-self: end;
	} */

	.table >*{
		align-self: center;
	}

	.key{
		display:inline-block;
		background-color:var(--main-faintgray-color);
		border:1px solid var(--main-lightgray-color);
		border-radius:3px;
		padding:.2em;
		box-sizing:border-box;
	}

	.tableheader{
		grid-column:span 2;
	}

	.buttons.table{
		grid-template-columns: 7em auto;
	}

	.iconset, .buttons{
		padding-right:2em;
		box-sizing:border-box
	}

	.showmorebtn{
		margin-top:2em;
		cursor:pointer
	}


</style>

<style media="screen">
.camtogglehelp .slider{
	display:inline-block;
	height:unset;
}
</style>