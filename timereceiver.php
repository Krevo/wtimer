<?php
  header("Access-Control-Allow-Origin: *");
  
  if (!file_exists("bib.data")) {
    touch("bib.data");
  }

  if (!file_exists("time.data")) {
    touch("time.data");
  }

  if (isset($_POST['timetab'])) {
    file_put_contents("time.data", $_POST['timetab']);    
  } else if (isset($_POST['bibtab'])) {
    file_put_contents("bib.data", $_POST['bibtab']);    
  }
  
  $timetab = json_decode(file_get_contents("time.data"), true);
  $bibtab = json_decode(file_get_contents("bib.data"), true);
  $res = ["timetab" => $timetab, "bibtab" => $bibtab];
  echo json_encode($res);
