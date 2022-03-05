<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$id = intval($data->id);
	$password = $data->password;
	
	if( $password != '' )
	{
		$result = $mysqli->query("SELECT password FROM scenes WHERE id = $id;")->fetch_assoc();
		
		if( !isset($result['password']) OR !password_verify($password, $result['password']) )
		{
			$error = [400, 'Bad Request', 'Wrong password'];
		}	
	}
	
	include_once 'inc/session.inc.php';
	
} else {
	$error = [400,'Bad Request','No data'];
}

