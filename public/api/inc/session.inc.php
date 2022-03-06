<?php

session_name('HYPERSESSID');
session_start();

if( !isset($_SESSION['scene_id']) && !isset($error[0]) && $password != '' )
{	
	$_SESSION['scene_id'] = $id;
	$response = array('message' => 'Successfully logged in');
}
else if( isset($_SESSION['scene_id']) && !isset($error[0]) )
{	
	if( $_SESSION['scene_id'] == $id )
	{
		$response = array('message' => 'Already logged in');
	}
	else
	{
		$error = [205, 'Reset Content', 'Login check failed'];
		session_unset();
	}
}
else if ( $id == 'logout' )
{	
	$error = [205, 'Reset Content', 'Successfully logged out'];
	session_unset();
}
else if ( isset($error[0]) )
{	
	// Error set in route
	session_unset();
}
else
{	
	// Fallback
	$error = [400, 'Bad Request', 'Credentials incorrect'];
	session_unset();
}

?>