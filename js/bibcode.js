/*


*/

var start;
var timeTab = new Array();
var bibTab = new Array();
var coureurs = null;
var audio = new Audio('sound/beep-08b.wav');
var displayInterval, sendDataInterval;
var paused = false;

$("#bib").keyup(function (e) {
    if (e.keyCode == 13) {
        fonctionValid();
    }
});

window.onload = function() {
  data = localStorage.getItem("bibTab");
  if (!!data) {
    if (confirm("Liste de dossards détecté, voulez-vous la reprendre ?")) {
      bibTab = JSON.parse(data);
    }
  }

  displayTimeTab();
  sendData(); // first call the server
  sendDataInterval = setInterval(sendData,5000); // send data to server every 15s

}

// fontion Valid
function fonctionValid() {
    audio.play();

    var readVal = $("#bib").val();
    for (var i = 0; i < bibTab.length; i++) {
      if (!bibTab[i].bib) {
        bibTab[i].bib = readVal;
        break;
      }
    }
    
    if (i==bibTab.length) {
      bibTab.push({
        bib: readVal
      });
    }

    displayTimeTab();
    saveToLocalStorage();
    log('ADD '+readVal);
    $("#bib").val('');
    $("#bib").focus();
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
  content += '<th>Clt. cat</th>';
  content += '<th>Clt. sex</th>';
  content += '<th>Distance</th>';
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  var cltsextab = [];
  var cltcattab = [];

  stopIndex = Math.min(timeTab.length, startIndex + nbToDisplay);
  for (var i = 0; i < timeTab.length; i++) {
  //for (var i = startIndex; i < Math.min(timeTab.length, startIndex + nbToDisplay); i++) {
    var bib = (!!bibTab[i])?bibTab[i].bib:'xxx';
    var nom = '';
    var cat = '';
    var distance = '';
    var cltsex = '';
    var cltcat = '';
    var sexe = '';
    if (bib != 'xxx' && !!coureurs && !!coureurs[bib]) {
      nom = coureurs[bib].Prenom.capitalizeFirstLetter() +' '+coureurs[bib].Nom.toUpperCase();
      cat = coureurs[bib].categorie;
      distance = coureurs[bib].Distance;
      sexe = cat.substr(2, 1);
      
      // class. par rapport au sexe
      var sexdist = sexe + distance;
      if (!cltsextab[sexdist]) {
        cltsextab[sexdist] = 0;
      }
      cltsextab[sexdist]++;
      cltsex = cltsextab[sexdist];

      // class. par rapport à la catégorie
      var catdist = cat + distance;
      if (!cltcattab[catdist]) {
        cltcattab[catdist] = 0;
      }
      cltcattab[catdist]++;
      cltcat = cltcattab[catdist];
    }
    
    if (i>=startIndex && i<stopIndex) {
      content += '<tr>';
      content += sprintf('<td>%d</td>', i+1);
      content += sprintf('<td>%s</td>', (!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x');
      content += sprintf('<td class="editable" id="bib_%d" onclick="editTime(%d);">%s&nbsp;<i class="fa fa-pencil"></i></td>', i, i, bib);
      content += sprintf('<td>%s</td>', nom);
      content += sprintf('<td>%s (%s)</td>', cltcat, cat);
      content += sprintf('<td>%s (%s)</td>', cltsex, sexe);
      content += sprintf('<td>%s</td>', distance);
      content += '</tr>\n';
    }
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function editTime(item_number) {
  //var initialContent = $("#bib_"+item_number).html();
  paused = true;
  var editValue = (!!bibTab[item_number].bib)?bibTab[item_number].bib:'xxx';
  $("#bib_"+item_number).removeAttr('onclick');
  $("#bib_"+item_number).html('<form id="editForm"><input id="editInput" type=text" size="3" value="'+editValue+'"></form>');
  $("#editInput").focus();
  
  $("#editInput").keypress(function(event) {
    console.log("old value => "+editValue);
    if (event.which == 13) {
        event.preventDefault();
        var newValue = $("#editInput").val();
        console.log("new value => "+newValue);
        //$("#editForm").submit();
        $("#bib_"+item_number).html(newValue+'&nbsp;<i class="fa fa-pencil"></i>');
        $("#bib_"+item_number).attr('onclick', 'editTime('+item_number+')');
        bibTab[item_number].bib = newValue;
        console.log(editValue+' -> '+newValue);
        log('MV '+editValue+' '+newValue);
        paused = false;
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem("bibTab", JSON.stringify(bibTab));
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
  if (paused) return;
  var sendTime = new Date();
  $("#status" ).html("Données envoyées à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
  $.post("http://"+getBackUrl()+"/timereceiver.php", {"bibtab": JSON.stringify(bibTab)}, function( data ) {
    sendTime = new Date();
    $("#status" ).html("Données reçues à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
    receivedData = $.parseJSON(data);
    timeTab = receivedData.timetab;
    displayTimeTab();
    saveToLocalStorage();
  });
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
