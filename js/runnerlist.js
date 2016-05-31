/*


*/

var timeTab = new Array();

function displayTimeTab(dist) {
  console.log("doit afficher le classement du "+dist+" km");
  var content = "";
  content += '<table id="tab">';
  content += '<thead>';
  content += '<tr>';
  content += '<th>#</th>';
  content += '<th>Temps</th>';
  content += '<th>N° dossard</th>';
  content += '<th>Nom</th>';
  //content += '<th>Cat</th>';
  content += '<th>Clt. cat</th>';
  content += '<th>Clt. sex</th>';
  content += '<th>Club</th>';
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  var rank = 0;
  for (var i = 0; i < timeTab.length; i++) {
    if (!!timeTab[i].distance && timeTab[i].distance==dist) {
      rank++;
      content += sprintf('<tr><td>%d</td><td>%s</td><td class="editable" id="bib_%d" onclick="editTime(%d);">%s&nbsp;<i class="fa fa-pencil"></i></td><td>%s</td><td>%s (%s)</td><td>%s (%s)</td><td>%s</td></tr>\n',rank,(!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x',i,i,(!!timeTab[i].bib)?timeTab[i].bib:'xxx',(!!timeTab[i].nom)?timeTab[i].nom:'',(!!timeTab[i].cltcat)?timeTab[i].cltcat:'',(!!timeTab[i].cat)?timeTab[i].cat:'',(!!timeTab[i].cltsex)?timeTab[i].cltsex:'',(!!timeTab[i].cat)?timeTab[i].cat.substr(2,1):'',(!!timeTab[i].club)?timeTab[i].club:'');
    }
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function readData(dist) {

  $.get("timereceiver.php", function( data ) {

  receivedTimeTab = $.parseJSON(data);
    for (var i = 0; i < receivedTimeTab.length; i++) {
      if (i>=timeTab.length) {
        timeTab.push({});
      }
      if (!!receivedTimeTab[i].time) {
        timeTab[i].time = receivedTimeTab[i].time;
      }
      if (!!receivedTimeTab[i].bib) {
        timeTab[i].bib = receivedTimeTab[i].bib;
      }
      if (!!receivedTimeTab[i].nom) {
        timeTab[i].nom = receivedTimeTab[i].nom;
      }
      if (!!receivedTimeTab[i].cat) {
        timeTab[i].cat = receivedTimeTab[i].cat;
      }
      if (!!receivedTimeTab[i].distance) {
        timeTab[i].distance = receivedTimeTab[i].distance;
      }
      if (!!receivedTimeTab[i].cltsex) {
        timeTab[i].cltsex = receivedTimeTab[i].cltsex;
      }
      if (!!receivedTimeTab[i].cltcat) {
        timeTab[i].cltcat = receivedTimeTab[i].cltcat;
      }
      if (!!receivedTimeTab[i].club) {
        timeTab[i].club = receivedTimeTab[i].club;
      }
    }
    displayTimeTab(dist);
  });
}
