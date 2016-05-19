/*


*/

var start, timeTab = new Array();
var audio = new Audio('sound/beep-08b.wav');
var displayInterval, sendDataInterval;

$("#bib").keyup(function (e) {
    if (e.keyCode == 13) {
        fonctionValid();
    }
});

displayTimeTab();
sendData(); // first call the server
sendDataInterval = setInterval(sendData,5000); // send data to server every 15s

// fontion Valid
function fonctionValid() {
    audio.play();

    for (var i = 0; i < timeTab.length; i++) {
      if (!timeTab[i].bib) {
        timeTab[i].bib = $("#bib").val();
        break;
      }
    }
    
    if (i==timeTab.length) {
      timeTab.push({
        bib: $("#bib").val()
      });
    }

    displayTimeTab();
    saveToLocalStorage();
    $("#bib").val('');
    $("#bib").focus();
}

function displayTimeTab() {
  var content = "";
  var nbToDisplay = 25;
  startIndex = Math.max(0, timeTab.length - nbToDisplay);
  content += '<table id="tab">';
  content += '<thead>';
  content += '<tr>';
  content += '<th>#</th>';
  content += '<th>Temps</th>';
  content += '<th>N° dossard</th>';
  content += '<th>Nom</th>';
  content += '<th>Cat</th>';
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  for (var i = startIndex; i < Math.min(timeTab.length, startIndex + nbToDisplay); i++) {
    content += sprintf('<tr><td>%d</td><td>%s</td><td class="editable">%s&nbsp;<i class="fa fa-pencil"></i></td><td>%s</td><td>%s</td></tr>\n',i+1,(!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x',(!!timeTab[i].bib)?timeTab[i].bib:'xxx',(!!timeTab[i].nom)?timeTab[i].nom:'',(!!timeTab[i].cat)?timeTab[i].cat:'');
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function saveToLocalStorage() {
  localStorage.setItem("bibTab", JSON.stringify(timeTab));
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

function sendData() {
  var sendTime = new Date();
  $("#status" ).html("Données envoyées à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
  $.post( "timereceiver.php", {"bibtab": JSON.stringify(timeTab)}, function( data ) {
    sendTime = new Date();
    $("#status" ).html("Données reçues à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
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
    }
    displayTimeTab();
    saveToLocalStorage();
  });
}
