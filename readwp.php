<?php

  $wpinscription = json_decode(file_get_contents("wp_inscription.json"), true);
  //var_dump($wpinscription);
  $coureurs = [];
  
  foreach($wpinscription as $val) {
    //var_dump($val);
    $coureurs[$val['numDossard']] = $val;
  }
  
  var_dump($coureurs);
  file_put_contents("coureurs.data", json_encode($coureurs));