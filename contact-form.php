<?php

error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");


if(isset($_POST['submit'])) {
  echo 'SUCCESS';
  $name = $_POST['name'];
  $mailFrom = $_POST['email'];
  $subject = 'Personal Enquiry via Portfolio';
  $message = $_POST['message'];

  // $mailTo = 'lukejsmcshane@gmail.com';
  $mailTo = 'test-f78cec0qc@srv1.mail-tester.com';
  $headers = 'From: '.$mailFrom;
  $txt = 'You have received an email from '.$name.".\n\n".$message;

  mail($mailTo, $subject, $txt, $headers);
  header('Location: index.php?mailsend');
}
>