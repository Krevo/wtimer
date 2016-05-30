/*


*/

var start, timeTab = new Array();
var audio = new Audio('sound/beep-08b.wav');
var displayInterval, sendDataInterval;
var paused = false;

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

    var readVal = $("#bib").val();
    for (var i = 0; i < timeTab.length; i++) {
      if (!timeTab[i].bib) {
        timeTab[i].bib = readVal;
        break;
      }
    }
    
    if (i==timeTab.length) {
      timeTab.push({
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
  startIndex = Math.max(0, timeTab.length - nbToDisplay);
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
  content += '<th>Distance</th>';
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>  ';
  for (var i = startIndex; i < Math.min(timeTab.length, startIndex + nbToDisplay); i++) {
    content += sprintf('<tr><td>%d</td><td>%s</td><td class="editable" id="bib_%d" onclick="editTime(%d);">%s&nbsp;<i class="fa fa-pencil"></i></td><td>%s</td><td>%s (%s)</td><td>%s (%s)</td><td>%s</td></tr>\n',i+1,(!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x',i,i,(!!timeTab[i].bib)?timeTab[i].bib:'xxx',(!!timeTab[i].nom)?timeTab[i].nom:'',(!!timeTab[i].cltcat)?timeTab[i].cltcat:'',(!!timeTab[i].cat)?timeTab[i].cat:'',(!!timeTab[i].cltsex)?timeTab[i].cltsex:'',(!!timeTab[i].cat)?timeTab[i].cat.substr(2,1):'',(!!timeTab[i].distance)?timeTab[i].distance:'');
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

function editTime(item_number) {
  //var initialContent = $("#bib_"+item_number).html();
  paused = true;
  var editValue = (!!timeTab[item_number].bib)?timeTab[item_number].bib:'xxx';
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
        timeTab[item_number].bib = newValue;
        console.log(editValue+' -> '+newValue);
        log('MV '+editValue+' '+newValue);
        paused = false;
    }
  });
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

function log(readVal) {
  $.post("http://"+getBackUrl()+"/log.php", {"log": readVal});
}

function sendData() {
  if (paused) return;
  var sendTime = new Date();
  $("#status" ).html("Données envoyées à "+sprintf("%01d:%02d:%02d",sendTime.getHours(),sendTime.getMinutes(),sendTime.getSeconds()));
  var onlyBibTab = [];
  for (var i = 0; i < timeTab.length; i++) {
    if (!!timeTab[i].bib) {
      onlyBibTab.push({
        bib: timeTab[i].bib
      });
    }
  }
  $.post("http://"+getBackUrl()+"/timereceiver.php", {"bibtab": JSON.stringify(onlyBibTab)}, function( data ) {
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
      if (!!receivedTimeTab[i].distance) {
        timeTab[i].distance = receivedTimeTab[i].distance;
      }
      if (!!receivedTimeTab[i].cltsex) {
        timeTab[i].cltsex = receivedTimeTab[i].cltsex;
      }
      if (!!receivedTimeTab[i].cltcat) {
        timeTab[i].cltcat = receivedTimeTab[i].cltcat;
      }
    }
    displayTimeTab();
    saveToLocalStorage();
  });
}
