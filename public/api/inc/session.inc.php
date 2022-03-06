<?php

session_name('HYPERSESSID');
session_start();

function session($id)
{
	if( isset($_SESSION['scene_id']) )
	{
		if( $_SESSION['scene_id'] === $id )
		{
			return true;
		}
	} 
	else 
	{
		return false;
	}
}

?>