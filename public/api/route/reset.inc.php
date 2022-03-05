<?php


if( $data=json_decode(file_get_contents('php://input')) ) {

	$auth_hash = $data->auth;
	$password = password_hash($data->password, PASSWORD_BCRYPT);

	$stmt = $mysqli->prepare("UPDATE scenes SET scenes.password = ? WHERE scenes.id = ( SELECT scene_id FROM recoveries WHERE auth_hash = ? );");
	$stmt->bind_param('ss', $password, $auth_hash);
	$stmt->execute();
	
	// If auth hash was correct and password could be changed
	if( $mysqli->affected_rows !== 0 ){
		
		$stmt = $mysqli->prepare("DELETE FROM recoveries WHERE auth_hash = ?;");
		$stmt->bind_param('s', $auth_hash);
		$stmt->execute();
		
		$response = array('message' => 'Your password has been changed');

	} else {
		$error = [400, 'Bad Request', 'Invalid reset link'];
	}
} else {
	$error = [400,'Bad Request','No data'];
}