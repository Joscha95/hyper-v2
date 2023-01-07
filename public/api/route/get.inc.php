<?php

if(isset($_GET['s'])) {
	
	$slug = urlencode($_GET['s']);
	$slug_part = explode('_', $slug);
	if( !isset($slug_part[1]) ) $slug_part[1]=1;

	$query = "
		SELECT
			scenes.id,
			scenes.channel_id,
			scenes.scene,
			scenes.updated_on,
			scenes.created_at,
			A.string AS current_slug,
			A.number AS current_slug_number
		FROM
			slugs A
		LEFT JOIN 
			scenes ON A.scene_id = scenes.id
		WHERE
			A.string = ? AND A.number = ?
	";


	$stmt = $mysqli->prepare($query);
	$stmt->bind_param('si', $string, $number);
	$string = $slug_part[0];
	$number = $slug_part[1];
	$stmt->execute();
	$result = $stmt->get_result()->fetch_array(MYSQLI_ASSOC);

	if( isset($result) ){
		if( $result['current_slug_number']!=1 ){
			$result['current_slug'].='_'.$result['current_slug_number'];
		}
		unset($result['current_slug_number']);
		$result['scene'] = json_decode($result['scene']);
		$response = $result;
	} else {
		$error = [404,'Not Found','No scene found'];
	}
} else {
	$error = [400,'Bad Request','No slug given'];
}