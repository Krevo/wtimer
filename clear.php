<?php

  $timestamp = date("Ymd_His");
  $bibFilename = "bib_".$timestamp.".data";
  $timeFilename = "time_".$timestamp.".data";
  //echo $bibFilename."<br>\n";
  //echo $timeFilename."<br>\n";
  
  if (file_exists("bib.data")) {
    rename("bib.data", $bibFilename);
    touch("bib.data");
  }

  if (file_exists("time.data")) {
    rename("time.data", $timeFilename);
    touch("time.data");
  }

  echo "OK";
  //echo json_encode("OK");