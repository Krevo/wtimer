/*


*/

var start;
var timeTab = new Array();
var bibTab = new Array();
var coureurs = null;
var audio = new Audio('sound/beep-08b.wav');
var displayInterval, sendDataInterval;

window.onload = function() {
  // Si ya un startTime ...
  startTime = localStorage.getItem("startTime");
  console.log(startTime);
  timeTab = JSON.parse(localStorage.getItem("timeTab"));
  console.log(timeTab);
  if (!!startTime) {
    if (confirm("Chronométrage en cours détecté, voulez-vous le poursuivre ?")) {
      start = new Date();
      start.setTime(startTime);
      console.log(startTime);
      fonctionStart(true);
    }
  }
}

function getFormatedCurrentTime() {
  var now = new Date();
  var d = new Date();
  d.setTime(now.getTime() - start.getTime());
  var displayStr = sprintf("%01d:%02d:%02d,%d",d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds(),d.getUTCMilliseconds()/100);
  return displayStr;
}

function displayStartTime() {
  $("#startTime").html(sprintf("%01d:%02d:%02d",start.getHours(),start.getMinutes(),start.getSeconds()));
}

function displayTimer() {
  $("#timer").html(getFormatedCurrentTime());
}

function displayTimeTab() {
  var content = "";
  var nbToDisplay = 25;
  if (!coureurs) {
    getCoureurs();
  }
  startIndex = Math.max(0, timeTab.length - nbToDisplay);
  content += '<table id="tab">';
  content += '<thead>';
  content += '<tr>';
  content += '<th>#</th>';
  content += '<th>Temps</th>';
  content += '<th>N° dossard</th>';
  content += '<th>Nom</th>';
  content += '<th>Cat</th>';
  content += '<th>Distance</th>';  
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  for (var i = startIndex; i < Math.min(timeTab.length, startIndex + nbToDisplay); i++) {
    var bib = (!!bibTab[i])?bibTab[i].bib:'xxx';
    var nom = '';
    var cat = '';
    var distance = '';
    if (bib != 'xxx' && !!coureurs && !!coureurs[bib]) {
      nom = coureurs[bib].Prenom.capitalizeFirstLetter() +' '+coureurs[bib].Nom.toUpperCase();
      cat = coureurs[bib].categorie;
      distance = coureurs[bib].Distance;
    }
    content += '<tr>';
    content += sprintf('<td>%2d</td>', i+1);
    content += sprintf('<td class="removable" onclick="removeTime(%s);">%s <i class="fa fa-trash"></i></td>', i, (!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x');
    content += sprintf('<td>%s</td>', bib);
    content += sprintf('<td>%s</td>', nom);
    content += sprintf('<td>%s</td>', cat);
    content += sprintf('<td>%s</td>', distance);
    content += '</tr>\n';
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function removeTime(item_number) {
  console.log("Want to remove item number "+item_number);
  log("DEL "+timeTab[item_number].time);
  timeTab.splice(item_number, 1);
  displayTimeTab();
  sendData();
}

// start
function fonctionStart(noReset) {
  fonctionReset(noReset);
  displayStartTime();
  displayInterval = setInterval(displayTimer,100); // display current timer every 0,1s
  sendDataInterval = setInterval(sendData,5000); // send data to server every 5s
  $("#boutonStart").prop('disabled', true);
}

// fontion Reset
function fonctionReset(noReset) {
  if (!noReset) {
    clearData();
    start = new Date();
    localStorage.setItem("startTime", start.getTime());
    timeTab = new Array();
  }
  displayTimeTab();
  saveToLocalStorage();
}

// fontion Split
function fonctionSplit(){
  audio.play();
  var readVal = getFormatedCurrentTime();
  timeTab.push({
    time: readVal
  });
  log('ADD '+readVal);
  console.log(timeTab);
  displayTimeTab();
  saveToLocalStorage();
}

// fontion Stop
function fonctionStop(){
  if (confirm("Etes vous sûr de vouloir stopper le chrono ?")) {
    clearInterval(displayInterval);  
    clearInterval(sendDataInterval);
    sendData();
    $("#boutonStart").prop('disabled', false);
    $("#boutonStart").prop('value', 'Re-start');
  }
}

function saveToLocalStorage() {
  localStorage.setItem("timeTab", JSON.stringify(timeTab));
}

function clearData() {
  $.get("http://"+getBackUrl()+"/clear.php");
}

function getBackUrl() {
  return $("#urlBack").val();
}

function testConnection() {
  var urlBack = getBackUrl();
  $.get("http://"+urlBack+"/ping.php")
    .done(function() {
      console.log("ok");
      $("#urlBack").removeClass("error").addClass("success");
    })
    .fail(function() {
      console.log("fail");
      $("#urlBack").removeClass("success").addClass("error");
    });
}

function log(readVal) {
  //$.post("http://"+getBackUrl()+"/log.php", {"log": readVal}); // log distant
  $.post("log.php", {"log": readVal}); // log en local
}

function getCoureurs() {
  $.get("coureurs.data", function( data ) {
    coureurs = $.parseJSON(data);
  });
}

function sendData() {
  var sendTime = new Date();
  $("#status" ).html("Données envoyées à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
  $.post("http://"+getBackUrl()+"/timereceiver.php", {"timetab": JSON.stringify(timeTab)}, function( data ) {
    sendTime = new Date();
    $("#status" ).html("Données reçues à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
    receivedData = $.parseJSON(data);
    bibTab = receivedData.bibtab;
    displayTimeTab();
    saveToLocalStorage();
  });
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
