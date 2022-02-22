<?php

header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');
header('Content-Type: application/json;charset=utf-8');

if (!empty(file_get_contents('php://input')))
{
	$data = json_decode( file_get_contents('php://input'));
	include_once 'inc/link.inc.php';

	switch ($_GET['r']) {
		case 'c':
			include_once('route/create.inc.php');
			break;
		case 'g':
			include_once('route/get.inc.php');
			break;
		default:
		   header('HTTP/1.1 401 Unauthorized');
	}
	$mysqli->close();
}