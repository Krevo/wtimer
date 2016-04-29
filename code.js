/*


*/

var start;
var timeTab = new Array();
var audio = new Audio('beep-08b.wav');
var displayInterval, sendDataInterval;

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
    //content += sprintf('<div class="editable">%2d.&nbsp;&nbsp;%s&nbsp;&nbsp;xxx&nbsp;<i class="fa fa-pencil"></i></div>\n',i+1,timeTab[i]);;   
    content += sprintf('<tr><td>%2d</td><td class="editable">%s <i class="fa fa-pencil"></i></td><td>%s</td><td></td><td></td></tr>\n',i+1,(!!timeTab[i].time)?timeTab[i].time:'x:xx:xx,x',(!!timeTab[i].bib)?timeTab[i].bib:'xxx');   
  }
  content += '</tbody></table>';
  $("#sidebar").html(content);
}

// start
function fonctionStart(){
  fonctionReset();
  displayStartTime();
  displayInterval = setInterval(displayTimer,100); // display current timer every 0,1s
  sendDataInterval = setInterval(sendData,15000); // send data to server every 15s
  $("#boutonStart").prop('disabled', true);
}

// fontion Reset
function fonctionReset(){
  clearData();
  start = new Date();
  timeTab = new Array();
  displayTimeTab();
  saveToLocalStorage();
}

// fontion Split
function fonctionSplit(){
  audio.play();
  timeTab.push({
    time: getFormatedCurrentTime()
  });
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
  }
  $("#boutonStart").prop('disabled', false);
  $("#boutonStart").prop('value', 'Re-start');
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

function sendData() {
  $.post("http://"+getBackUrl()+"/timereceiver.php", {"timetab": JSON.stringify(timeTab)}, function( data ) {
    $("#status" ).html( data );
    receivedTimeTab = $.parseJSON(data);
    for (var i = 0; i < receivedTimeTab.length; i++) {
      if (i==timeTab.length) { // On s'arrête si receivedTimeTab est plus grand ... (ce qui serait très étonnant !!)
        break; 
      }
      if (!!receivedTimeTab[i].bib) {
        timeTab[i].bib = receivedTimeTab[i].bib;
      }
    }
    displayTimeTab();
    saveToLocalStorage();
  });
}
