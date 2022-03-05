<?php

$dbhost = file_get_contents('.secrets/.dbhost', FILE_USE_INCLUDE_PATH);
$dbuser = file_get_contents('.secrets/.dbuser', FILE_USE_INCLUDE_PATH);
$dbpassword = file_get_contents('.secrets/.dbpassword', FILE_USE_INCLUDE_PATH);
$dbname = file_get_contents('.secrets/.dbname', FILE_USE_INCLUDE_PATH);

$mysqli = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);

if ($mysqli->connect_error) {
  die("Connection failed: " . $mysqli->connect_error);
}
$mysqli->set_charset("utf8");