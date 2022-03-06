<?php

if( $data=json_decode(file_get_contents('php://input')) ) {
	include_once 'inc/session.inc.php';

	if( $data->id === 'logout' )
	{
		$error = [205, 'Reset Content', 'Successfully logged out'];
		session_unset();
	}
	else
	{
		$id = intval($data->id);
		$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
		$password = $data->password;
		
		$result = $mysqli->query("SELECT email, password FROM scenes WHERE id = $id;")->fetch_assoc();
		
		if( session($id) && isset($result['email']) && $email === '' && $password === '' )
		{	
			$response = array('message' => 'Already logged in', 'email' => $result['email']);	
		}
		else
		{
			if( $email == $result['email'] && password_verify($password, $result['password']) )
			{
				$_SESSION['scene_id'] = $id;
				$response = array('message' => 'Successfully logged in', 'email' => $result['email']);
			}
			else
			{
				$error = [400, 'Bad Request', 'Credentials incorrect'];
			}
		}
	}
} else {
	$error = [400,'Bad Request','No data'];
}