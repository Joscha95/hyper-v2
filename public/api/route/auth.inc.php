<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$id = intval($data->id);
	$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	$password = $data->password;
	
	if( $email != '' && $password != '' )
	{
		$result = $mysqli->query("SELECT email, password FROM scenes WHERE id = $id;")->fetch_assoc();
		
		if( !isset($result['email']) OR $email != $result['email'] OR !password_verify($password, $result['password']) )
		{
			$error = [400, 'Bad Request', 'Credentials incorrect'];
		}	
	}
	
	include_once 'inc/session.inc.php';
	
} else {
	$error = [400,'Bad Request','No data'];
}