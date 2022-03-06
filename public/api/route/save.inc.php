<?php

if( $data=json_decode(file_get_contents('php://input')) ) {
	include_once 'inc/session.inc.php';

	$id = intval($data->id);
	$scene = json_encode($data->scene);
	$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	$password = $data->password;
	
	// get auth data
	$result = $mysqli->query("SELECT email, password FROM scenes WHERE id = $id;")->fetch_assoc();
	
	// prepare save query
	$stmt = $mysqli->prepare("UPDATE scenes SET scene = ? WHERE id = ?;");
	$stmt->bind_param('si', $scene, $id);
	
	// Check auth
	if( session($id) && isset($result['email']) && $password === '' )
	{
		// if previously logged in, scene id in sessions
	}
	else if( $email == $result['email'] && password_verify($password, $result['password']) )
	{
		// Email & PW match
	} 
	else 
	{
		$error = [400, 'Bad Request', 'Credentials incorrect'];
	}
	
	// If auth > save scene
	if( !$error )
	{
		$stmt->execute();
	
		if( !$mysqli->error )
		{			
			$response = array('message' => 'Saved');
		} 
		else 
		{
			$error = [500, 'Internal Server Error', 'Scene could not be saved'];
		}
	}
	
} else {
	$error = [400,'Bad Request','No data'];
}