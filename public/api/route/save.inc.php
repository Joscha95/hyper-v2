<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$id = intval($data->id);
	$scene = json_encode($data->scene);
	$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	$password = $data->password;
	
	$result = $mysqli->query("SELECT email, password FROM scenes WHERE id = $id;")->fetch_assoc();
			
	// If ID and password match the scene
	if( $email == $result['email'] && password_verify($password, $result['password']) ){
		
		$stmt = $mysqli->prepare("UPDATE scenes SET scene = ? WHERE id = ?;");
		$stmt->bind_param('si', $scene, $id);
		$stmt->execute();
		
		if( !$mysqli->error ){
			
			$response = array('message' => 'Saved');
			
		} else {
			$error = [500, 'Internal Server Error', 'Scene could not be saved'];
		}
	} else {
		$error = [400, 'Bad Request', 'Credentials incorrect'];
	}
} else {
	$error = [400,'Bad Request','No data'];
}