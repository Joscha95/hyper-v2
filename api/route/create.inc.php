<?php

$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
$password = password_hash($data->password, PASSWORD_BCRYPT);
$channel_id = intval($data->channel->id);
$slug = urlencode($data->channel->slug);

$query = "
INSERT INTO scenes (email, password, channel_id) VALUES ('$email', '$password', '$channel_id');
SET @scene_id = LAST_INSERT_ID();
SET @number = (SELECT COUNT(id) FROM slugs WHERE string LIKE '$slug')+1;
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
	header('HTTP/1.1 500 Internal Server Error');
	echo json_encode(array('error' => $mysqli->error));
} else {
	$mysqli->commit();
	header('HTTP/1.1 201 Created');
	echo json_encode(array('slug' => $slug.$counter));
}