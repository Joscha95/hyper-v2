<?php


session_name('HYPERSESSID');
session_start();

if(!isset($_SESSION['scene_id'])){
	
	$_SESSION['scene_id'] = $id;
	$response = array('message' => 'Session created');

}else if($_SESSION['scene_id'] != $id){
	
	session_unset();
	$response = array('message' => 'Session unset');
	
}else{

	$response = array('message' => 'Already logged in');
}

?>