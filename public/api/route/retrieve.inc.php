<?php


if( $data=json_decode(file_get_contents('php://input')) ) {

	$owner = filter_var($data->email, FILTER_SANITIZE_EMAIL);
	
	$query = "
		SELECT
			A.channel_id,
			A.updated_on,
			slugs.string AS current_slug,
			slugs.number AS current_slug_number
		FROM
			scenes A
		LEFT JOIN slugs ON A.slug_id = slugs.id
		WHERE
			A.email = ?
		ORDER BY
			A.updated_on DESC
	";

	$stmt = $mysqli->prepare($query);
	$stmt->bind_param('s', $owner);  
	$stmt->execute();
	$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
	
	
	if( isset($result) ){
		if( count($result) === 0 ){
			$error = [204,'No Content','No scenes found for given email'];
		} else {
			$response = $result;
		}
	} else {
		$error = [404,'Not Found','No scene found'];
	}
} else {
	$error = [400,'Bad Request','No email given'];
}