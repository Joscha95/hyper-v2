<?php

header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');
header('Content-Type: application/json;charset=utf-8');
$error=false;
include_once 'inc/link.inc.php';

if(isset($_GET['r'])){
	switch ($_GET['r']) {
		case 'c':
			include_once('route/create.inc.php');
			break;
		case 'g':
			include_once('route/get.inc.php');
			break;
		case 's':
			include_once('route/save.inc.php');
			break;
		case 'cs':
			include_once('route/changeslug.inc.php');
			break;
		case 'r':
			include_once('route/recover.inc.php');
			break;
		case 'pw':
			include_once('route/reset.inc.php');
			break;
		default:
			$error = [404,'Bad Request','Wrong route.'];
	}
}else{
	$error = [400,'Bad Request','Invalid route'];
}

$mysqli->close();
if( isset($response) )
{
	header('HTTP/1.1 200 OK');
} 
else if( isset($error[0]) ) 
{
	header('HTTP/1.1 '.$error[0].' '.$error[1]);
	$response = array('code' => $error[0], 'message' => $error[1], 'description' => $error[2]);
} 
else 
{
	header('HTTP/1.1 '.'500 Internal Server Error');
	$response = array('code' => 500, 'message' => 'Internal Server Error', 'description' => 'no response or error set');
}
echo json_encode($response);