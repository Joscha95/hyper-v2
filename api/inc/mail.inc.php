<?php

$mailserver = file_get_contents('.secrets/.mailserver', FILE_USE_INCLUDE_PATH);
$mailuser = file_get_contents('.secrets/.mailuser', FILE_USE_INCLUDE_PATH);
$mailpassword = file_get_contents('.secrets/.mailpassword', FILE_USE_INCLUDE_PATH);
$mailaddress = file_get_contents('.secrets/.mailaddress', FILE_USE_INCLUDE_PATH);

use PHPMailer\PHPMailer\PHPMailer; 
use PHPMailer\PHPMailer\Exception; 

require 'vendor/PHPMailer/Exception.php'; 
require 'vendor/PHPMailer/PHPMailer.php'; 
require 'vendor/PHPMailer/SMTP.php'; 

$mail = new PHPMailer; 
$mail->isSMTP();
$mail->Host = $mailserver;
$mail->SMTPAuth = true;
$mail->Username = $mailuser;
$mail->Password = $mailpassword;
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$mail->isHTML(true);
$mail->setFrom($mailaddress, $sender);
$mail->addReplyTo($mailaddress, $sender);
$mail->addAddress($recipient);
$mail->Subject = $subject;
$mail->Body = $content;