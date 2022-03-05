<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$id = intval($data->id);
	$password = $data->password;

	$result = $mysqli->query("SELECT password FROM scenes WHERE id = $id;")->fetch_assoc();

	// If ID and password match the scene
	if( password_verify($password, $result['password']) ){

		include_once 'inc/session.inc.php';

		//$response = array('message' => 'Took this route');

	} else {
		$error = [400, 'Bad Request', 'Password incorrect.'];
	}
} else {
	$error = [400,'Bad Request','No data.'];
}