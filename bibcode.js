/*


*/

var start, timeTab = new Array();;
var audio = new Audio('beep-08b.wav');
var displayInterval, sendDataInterval;

$("#bib").keyup(function (e) {
    if (e.keyCode == 13) {
        fonctionValid();
    }
});

displayTimeTab();
sendDataInterval = setInterval(sendData,15000); // send data to server every 15s

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
    content += sprintf('<tr><td>%d</td><td>%s</td><td class="editable">%s&nbsp;<i class="fa fa-pencil"></i></td><td></td><td></td></tr>\n',i+1,(!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x',(!!timeTab[i].bib)?timeTab[i].bib:'xxx');
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function saveToLocalStorage() {
  localStorage.setItem("bibTab", JSON.stringify(timeTab));
}

function sendData() {
  $.post( "timereceiver.php", {"bibtab": JSON.stringify(timeTab)}, function( data ) {
    $("#status" ).html( data );
    receivedTimeTab = $.parseJSON(data);
    for (var i = 0; i < receivedTimeTab.length; i++) {
      if (i<timeTab.length) {
        if (!!receivedTimeTab[i].time) {
          timeTab[i].time = receivedTimeTab[i].time;
        }
      } else {
        timeTab.push({
          time: receivedTimeTab[i].time
        });
      }
    }
    displayTimeTab();
    saveToLocalStorage();
  });
}
