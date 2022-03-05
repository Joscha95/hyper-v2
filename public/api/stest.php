<?php


session_name('HYPERSESSID');
session_start();


if(!isset($_SESSION['slug'])){
	
	$_SESSION['slug'] = $_GET['slug'];

}else if($_SESSION['slug'] != $_GET['slug']){
	session_unset();
}else{
	if (!isset($_SESSION['count'])) {
		$_SESSION['count'] = 0;
	} else {
		$_SESSION['count']++;
	}
	echo 'The count for slug:'. $_SESSION['slug'] .'='. $_SESSION['count'];
}


?>