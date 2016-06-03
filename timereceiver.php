<?php

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
  //$coureurs = json_decode(file_get_contents("coureurs.data"), true);

  // Association temps <-> numéro de dossard
  /*
  $b = 0;
  foreach($timetab as &$item) {
    if (!isset($bibtab[$b])) {
      break;
    }
    if (isset($bibtab[$b]['bib'])) {
      $item['bib'] = $bibtab[$b++]['bib'];
      if (isset($coureurs[$item['bib']])) {
        $item['nom'] = ucfirst(strtolower($coureurs[$item['bib']]['Prenom'])).' '.strtoupper($coureurs[$item['bib']]['Nom']);
        $item['cat'] = $coureurs[$item['bib']]['categorie'];
        $item['distance'] = $coureurs[$item['bib']]['Distance'];
        $item['club'] = $coureurs[$item['bib']]['Club'];

        $sex = substr($item['cat'], 2, 1).$item['distance'];
        if (!isset($cltsex[$sex])) {
          $cltsex[$sex] = 0;
        }
        $cltsex[$sex]++;
        $item['cltsex'] = $cltsex[$sex];
        $cat = $item['cat'].$item['distance'];
        if (!isset($cltcat[$cat])) {
          $cltcat[$cat] = 0;
        }
        $cltcat[$cat]++;
        $item['cltcat'] = $cltcat[$cat];
      }
    }
  }
  */

  $res = ["timetab" => $timetab, "bibtab" => $bibtab];
  //var_dump($bibtab);
  //var_dump($timetab);  
  
  //echo "OK";

  echo json_encode($res);
