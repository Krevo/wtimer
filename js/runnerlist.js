/*


*/

var timeTab = new Array();
var bibTab = new Array();
var coureurs = null;

function displayTimeTab(dist) {
  console.log("doit afficher le classement du "+dist+" km");
  if (!coureurs) {
    getCoureurs(dist);
  }
  var content = "";
  content += '<table id="tab">';
  content += '<thead>';
  content += '<tr>';
  content += '<th>#</th>';
  content += '<th>Temps</th>';
  content += '<th>N° dossard</th>';
  content += '<th>Nom</th>';
  content += '<th>Clt. cat</th>';
  content += '<th>Clt. sex</th>';
  content += '<th>Club</th>';
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  var rank = 0;
  var cltsextab = [];
  var cltcattab = [];

  for (var i = 0; i < timeTab.length; i++) {
    console.log("i = "+i);
    var bib = (!!bibTab[i]) ? bibTab[i].bib : 'xxx';
    var nom = '';
    var cat = '';
    var distance = '';
    var cltsex = '';
    var cltcat = '';
    var sexe = '';
    var club = '';
    if (bib != 'xxx' && !!coureurs && !!coureurs[bib]) {
      nom = coureurs[bib].Prenom.capitalizeFirstLetter() +' '+coureurs[bib].Nom.toUpperCase();
      cat = coureurs[bib].categorie;
      distance = coureurs[bib].Distance;
      club = coureurs[bib].Club;
      sexe = cat.substr(2, 1);
      var sexdist = sexe + distance;
      if (!cltsextab[sexdist]) {
        cltsextab[sexdist] = 0;
      }
      cltsextab[sexdist]++;
      var cltsex = cltsextab[sexdist];
      var catdist = cat + distance;
      if (!cltcattab[catdist]) {
        cltcattab[catdist] = 0;
      }
      cltcattab[catdist]++;
      var cltcat = cltcattab[catdist];

    }
    if (distance == dist) {
      rank++;
      content += '<tr>';
      content += sprintf('<td>%d</td>', rank);
      content += sprintf('<td>%s</td>', (!!timeTab[i].time) ? timeTab[i].time : 'x:xx:xx,x');
      content += sprintf('<td>%s</td>', bib);
      content += sprintf('<td>%s</td>', nom);
      content += sprintf('<td>%s (%s)</td>', cltcat, cat);
      content += sprintf('<td>%s (%s)</td>', cltsex, sexe);
      content += sprintf('<td>%s</td>', club);
      content += '</tr>\n';
    }
  }
  $("#sidebar").html(content);
}

function getCoureurs(dist) {
  console.log("getCoureur");
  $.get("coureurs.data", function( data ) {
    coureurs = $.parseJSON(data);
    console.log("getCoureur received");
    displayTimeTab(dist);
  });
}

function readData(dist) {
  $.get("timereceiver.php", function( data ) {
    receivedData = $.parseJSON(data);
    bibTab = receivedData.bibtab;
    timeTab = receivedData.timetab;
    displayTimeTab(dist);
  });
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
