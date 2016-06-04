<?php
  header("Access-Control-Allow-Origin: *");
  
  if (!file_exists("wtimer.log")) {
    touch("wtimer.log");
  }

  if (isset($_POST['log'])) {
    file_put_contents("wtimer.log", date("YmdHis ").$_POST['log']."\n", FILE_APPEND);
  }
  
  echo "OK";
