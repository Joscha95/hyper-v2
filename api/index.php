<?php

header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');
header('Content-Type: application/json;charset=utf-8');
$data = json_decode(file_get_contents('php://input'));

switch ($_GET['r']) {
	case 'c':
		// CREATE SCENE AND AUTH FILE
		include_once('route/create.inc.php');
		break;
	default:
	   header('HTTP/1.1 401 Unauthorized');
}