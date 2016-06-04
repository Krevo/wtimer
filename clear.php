<?php
  header("Access-Control-Allow-Origin: *");
  
  $timestamp = date("Ymd_His");
  $filenames = ["wtimer.log", "bib.data", "time.data"];

  foreach($filenames as $filename) {
    if (file_exists($filename)) {
      rename($filename, $filename.".".$timestamp);
      touch($filename);
    }
  }
  
  echo "OK";