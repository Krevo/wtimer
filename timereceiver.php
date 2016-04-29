<?php

  if (!file_exists("bib.data")) {
    touch("bib.data");
  }

  if (!file_exists("bib.data")) {
    touch("time.data");
  }

  if (isset($_POST['timetab'])) {
    file_put_contents("time.data", $_POST['timetab']);    
  } else if (isset($_POST['bibtab'])) {
    file_put_contents("bib.data", $_POST['bibtab']);    
  }
  
  $timetab = json_decode(file_get_contents("time.data"), true);
  $bibtab = json_decode(file_get_contents("bib.data"), true);

  // Association temps <-> numéro de dossard
  $b = 0;
  foreach($timetab as &$item) {
    if (!isset($bibtab[$b])) {
      break;
    }
    if (isset($bibtab[$b]['bib'])) {
      $item['bib'] = $bibtab[$b++]['bib'];
    }
  }
  
  //var_dump($bibtab);
  //var_dump($timetab);  
  
  //echo "OK";

  echo json_encode($timetab);