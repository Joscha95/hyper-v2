<?php

$config = [
	'dir' => '../public/scenes/',
	'tempDir' => '../public/scenes/temp/',
	'authDir' => '../public/scenes/auth/',
	'tempBypass' => true
];

if(!$config['tempBypass']){
	// creates the files with a very unique id and puts them in temp fold
	// user gets send the unique id via mail
	// he can active his hyper scene and confirm his mail
	$slug = $data->channel->slug.'_'.uniqid();
	$scenePath = $config['tempDir'].$slug.'.json';
} else {
	// if scene file for same slug exists, count up
	$slug = $data->channel->slug;
	for( $i=1; file_exists($config['dir'].$slug.'.json'); $i++ ){
		$slug = $data->channel->slug.'_'.$i;
	}
	$scenePath = $config['dir'].$slug.'.json';
}
$authPath = $config['authDir'].$slug.'.json';

// create scene and auth file
$sceneFile = fopen($scenePath, 'w') or die('Unable to write scene file.');
$authFile = fopen($authPath, 'w') or die('Unable to write auth file.');

// write channel data to scene file
$channel = array('channel' => $data->channel);
if ( fwrite( $sceneFile, json_encode($channel) ) === false ) {
	header('HTTP/1.1 500 Internal Server Error');
	$response = "Cannot write to scene file.";
} else {
	header('HTTP/1.1 201 Created');
	$response = $slug;
}

// write email and hashed pw to auth file
unset($data->channel);
$data->auth = hash('sha256', $data->auth, false);
if ( fwrite( $authFile, json_encode($data) ) === false ) {
	header('HTTP/1.1 500 Internal Server Error');
	$response = "Cannot write to auth file.";
} else {
	header('HTTP/1.1 201 Created');
}
echo $response;
exit;