<template>
	<div id="help" class="popup">
		<div class="popup_body">

			<span class="bold">Help</span> <br><br>

				<!--<span class="icon arrows"></span>-->
				<u>Toolbar</u> <br>
				<span class="icon margin eye"></span>focus element <br>
				<span class="icon margin move"></span>move element <br>
				<span class="icon margin connect"></span>begin connection <br>
				<span class="icon margin dynamic"></span>node is dynamic <span class="more_info_container"><span class="more_info_qmark">?</span> <span class="more_info_content">A click here makes the node <u>static</u>. It will stay where you move it and will not be affected by the forces of other nodes.</span> </span> <br>
				<span class="icon margin anchor"></span>node is fixed <span class="more_info_container"><span class="more_info_qmark">?</span> <span class="more_info_content">A click here makes the node <u>dynamic</u> and with that affected by repulsive forces of other nodes around it.</span> </span> <br>
				<span class="icon margin threadstart"></span>start a thread <span class="more_info_container"><span class="more_info_qmark">?</span> <span class="more_info_content">A thread can be seen as a guideline for any visitor of your hyperspace. You can have only one thread.<br>Clicking this button will start your thread at the selected node.</span> </span> <br>
				<span class="icon margin threaddelete"></span>remove node from thread <br>
				<br>

				<u>Lookouts</u> <span class="icon lookout"></span> <br>
				On the bottom right fo your screen you can add a lookout with this button:
				<div id="lookout_btn" class="lookout_btn" >
		      <span >Add</span>
				  <span class="icon lookout"></span>
			  </div>. If you have entered a Lookout (by clicking the eye icon <span class="icon eye"/>) you can lock it to the camera position and rotation by entering the transform mode:
				<div id="lookout_btn" class="transform lookout_btn" >
		      <span>Move</span>
				  <span class="icon lookout"></span>
			  </div> <br>
				<br>

				<u>Camera</u><br>
		    There two camera modes:  First person (<span class="icon firstperson"/>) and orbit mode (<span class="icon orbit"/>).<br> You can toggle between them by clicking this switch on the lower right of your screen: <toggle id="camera_toggle" off="firstperson" on="orbit" tooltipOff="First person camera" tooltipOn="Orbit camera" :bool="false" :icon="true"/> or by pressing "o" on your keyboard.<br><br>
				<u>Connections</u><br>
				Connections (<span class="icon link"/>) can be enriched by a description in the <span class="editor_button">Edit</span>-Panel. If the connected nodes are dynamic (<span class="icon dynamic"/>) the connection acts as a force that keeps them sticking together.<br>You can change the distance by dragging the number in the Editor vertically:
				<div class="connection_properties_wrapper">
					<div class="connection_properties help">
				  	<a class="connection_property_circle" ></a>
				  	<draggableNumber :value="512" />
				  	<a class="connection_property_circle" ></a>
					</div>
				</div>. The round dots will focus the connected Nodes in your view.<br><br>

				<u>Thread</u><br>
				The thread guides visitor through your scene. If a Node is in focus, which is also part of the thread the navigator will appear in the bottom of your screen. With the arrows (<span class="icon threadprev"/> and <span class="icon threadnext"/>) you can navigate to the previous/next Node.<br>Hovering over the thread will let you <span class="icon threadinsert"/> insert a node in your thread. <br>

				<!-- <span class="icon trash"/>
				<span class="icon trashopen"/>
				<span class="icon refresh"/> -->

			<!--<table>
						<tbody>
							<tr>
							<td>mouse left</td><td>=</td><td>look</td>
						</tr>
						<tr>
							<td>mouse right</td><td>=</td><td>pan</td>
						</tr>
						<tr>
							<td>scroll</td><td>=</td><td>move</td>
						</tr>
						<tr>
							<td>click on block</td><td>=</td><td>zoom</td>
						</tr>
						<tr>
							<td>WASD</td><td>=</td><td>move</td>
						</tr>
						<tr>
							<td>←/→ </td><td>=</td><td>back/forward</td>
						</tr>
						<tr>
							<td>c</td><td>=</td><td>center selected</td>
						</tr>
						<tr>
							<td>&gt;</td><td>=</td><td>links</td>
						</tr>
					  </tbody>
					</table>-->

		</div>
	</div>
</template>

<script>
import toggle from '@/components/stage/subcomponents/toggle.vue'
import draggableNumber from '@/components/stage/subcomponents/draggable-number.vue'
export default {
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

	.icon.margin {
    margin-right: 1em;
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

</style>