<?php


if( $data=json_decode(file_get_contents('php://input')) ) {

	$recipient = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	$id = intval($data->id);
	$auth_hash = uniqid();

	$sender = 'hyper';
	$subject = 'Reset your password';
	$content = "
		<p>To reset your password for $sender follow this link:</p>
		<p>
			<a href='https://hyperchannel.net/reset/$auth_hash'>Password reset</a>
		</p>
	";

	$stmt = $mysqli->prepare("SELECT id FROM scenes WHERE id = ? AND email = ?;");
	$stmt->bind_param('is', $id, $recipient);
	$stmt->execute();
	$result = $stmt->get_result()->fetch_array(MYSQLI_ASSOC);
	
	// If ID and mail address match the scene
	if( isset($result) ){
		
		$stmt = $mysqli->prepare("INSERT INTO recoveries (scene_id, auth_hash) VALUES (?, ?);");
		$stmt->bind_param('is', $id, $auth_hash);
		$stmt->execute();
		
		if( $mysqli->affected_rows === 1 ){

			include_once('inc/mail.inc.php');
						
			if( $mail->send() ){
				$response = array('message' => 'A mail with a password reset link has been sent (check spam folder)');
			} else {
				$error = [500, 'Internal Server Error', 'Message could not be sent. Mailer Error: '.$mail->ErrorInfo];
			}
		} else {
			$error = [500, 'Internal Server Error', 'Reset link could not be created'];
		}
	} else {
		$error = [400, 'Bad Request', 'The provided mail address does not match this scene'];
	}
} else {
	$error = [400,'Bad Request','No data'];
}