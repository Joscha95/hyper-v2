<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$id = intval($data->id);
	$scene = json_encode($data->scene);
	$password = $data->password;
	
	$result = $mysqli->query("SELECT password FROM scenes WHERE id = $id;")->fetch_assoc();
			
	// If ID and password match the scene
	if( password_verify($password, $result['password']) ){
		
		$stmt = $mysqli->prepare("UPDATE scenes SET scene = ? WHERE id = ?;");
		$stmt->bind_param('si', $scene, $id);
		$stmt->execute();
		
		if( !$mysqli->error ){
			
			$response = array('message' => 'saved');
			
		} else {
			$error = [500, 'Internal Server Error', 'Scene could not be saved.'];
		}
	} else {
		$error = [400, 'Bad Request', 'Password incorrect.'];
	}
} else {
	$error = [400,'Bad Request','No data.'];
}