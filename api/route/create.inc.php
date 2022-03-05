<?php

if( $data=json_decode(file_get_contents('php://input')) ) {

	$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	$password = password_hash($data->password, PASSWORD_BCRYPT);
	$channel_id = intval($data->channel->id);
	$slug = urlencode($data->channel->slug);
	
	$query = "
		INSERT INTO scenes (email, password, channel_id) VALUES ('$email', '$password', '$channel_id');
		SET @scene_id = LAST_INSERT_ID();
		SET @number = (SELECT COUNT(id) FROM slugs WHERE string = '$slug')+1;
		INSERT INTO slugs (scene_id, string, number) VALUES (@scene_id, '$slug', @number );
		SET @slug_id = LAST_INSERT_ID();
		UPDATE scenes SET slug_id = @slug_id WHERE id = @scene_id;
		SELECT @number;
	";
	
	$mysqli->autocommit(FALSE);
	$mysqli->begin_transaction();
	$mysqli->multi_query($query);
	do {
		if ($result = $mysqli->store_result()) {
			while ($row = $result->fetch_row()) {
				$counter = $row[0]!=1 ? '_'.$row[0] : '';
			}
		}
	} while ($mysqli->next_result());
	
	if( $mysqli->error ){
		$mysqli->rollback();
		$error = [500,'Internal Server Error',$mysqli->error];
	} else {
		$mysqli->commit();
		$response = array('slug' => $slug.$counter);
	}
	
} else {
	$error = [400,'Bad Request','No data'];
}