// (optional) add server code here
var SERVER_BASE_URL = 'https://telemedicineapp.herokuapp.com/';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
  return res.json()
}).then(function(res) {
  initializeFirebase();
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeSession();
}).catch(handleError);

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
var count = 0;
var dataSet = [];
var currUID = "";
var callerName = "";
var publisherName = "";
var currentdate = new Date();
var date = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate() + "/" 
                + currentdate.getFullYear();

var time = currentdate.getHours() + ":"  
+ currentdate.getMinutes();

console.log(date + " " + time);

function initializeSession() {

  var session = OT.initSession(apiKey, sessionId);
  

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
      callerName = event.stream.name;
      let r = confirm(callerName + " is trying to start a call with you. Accept?");
      if (r == true){
        getUserInfo();
        getCallLogs();
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
      } else {
        session.disconnect();
      }
    });

  // Create a publisher
  console.log("init publisher: " + publisherName);
  var publisher = OT.initPublisher('publisher', {
    name: publisherName,
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  session.on("streamDestroyed", function (event) {
    console.log("Stream stopped. Reason: " + event.reason);
  });
} 

function endcall(){
  firebase.auth().signOut().then(function() {
    console.log("Signed out successfully.");
    
    window.location='login.html';
  }).catch(function(error) {
    // An error happened.
  });  
}

function initializeFirebase() {
  var config = {
    apiKey: "AIzaSyD859JZHYRGQfalwZZjQEk8e0s8EBAycaM",
    authDomain: "videochat-84e5a.firebaseapp.com",
    databaseURL: "https://videochat-84e5a.firebaseio.com",
    projectId: "videochat-84e5a",
    storageBucket: "videochat-84e5a.appspot.com",
    messagingSenderId: "592854475519"
  };
  firebase.initializeApp(config);
  var selected = localStorage.getItem('publisher_name');
  console.log("selected: " + selected);
  publisherName = selected;
}

function getUserInfo(){
  var database = firebase.database();
  var ref = database.ref().child("Users");
  ref.on('value', (snapshot) => {
    snapshot.forEach((child) => {
      uid = child.key;
      firebase.database().ref('Users/' + uid + '/name').on('value', (snapchild) => {
          if(snapchild.val() == callerName){
              currUID = uid;
          }   
      });
    });
  var temp = '/' + publisherName;
  // firebase.database().ref('Call_History/' + currUID + temp).push({
  // date: date,
  // time: time
  // });


  var name = "";
  var age = "";
  var medical_history = "";
  var prescription_history = "";
  var insurance = "";
  var allergy_history = "";
  firebase.database().ref('Users/' + currUID).on('value', (snapchild) => {
      name = snapchild.val().name;
      age = snapchild.val().age;
      medical_history =  snapchild.val().medical_history
      prescription_history = snapchild.val().prescription_history
      insurance = snapchild.val().insurance
      allergy_history = snapchild.val().allergy_history
  });
  var name_header = document.getElementById("name");
  var age_header = document.getElementById("age");
  var insurance_header = document.getElementById("insurance");
  var mh_header = document.getElementById("medical_history");
  var ph_header = document.getElementById("prescription_history");
  var allergy_header = document.getElementById("allergy_history");
  name_header.textContent = "Name: " + name;
  age_header.textContent = "Age: " + age;
  insurance_header.textContent = "Insurance: " + insurance;
  allergy_header.textContent = "Allergy_History: " + allergy_history;
  mh_header.textContent = "Medical History: " + medical_history;
  ph_header.textContent = "Prescription History: " + prescription_history;
  });
}

function getCallLogs(){
  var table = $('#call_log').DataTable( {
    "lengthMenu": [5],
    "columns": [
        { title: "Date" },
        { title: "Time" },
        { title: "With Who" }
    ]
  } );
  firebase.database().ref().child("Users").on('value', (snapshot) => {
    snapshot.forEach((child) => {
      uid = child.key;
      firebase.database().ref('Users/' + uid + '/name').on('value', (snapchild) => {
          if(snapchild.val() == callerName){
              currUID = uid;
          }   
      });
    });

  var callLog = [];
  var tableRef = firebase.database().ref('Call_History/' + currUID + '/' + publisherName);
  tableRef.once('value', function(userSnapshot){
    userSnapshot.forEach(function(userSnapshot) {
      userSnapshot.forEach(function(userSnapshot) {
        callLog.push(userSnapshot.val());
        count += 1;
          if(count % 2 == 0){
            callLog.push(publisherName);
            table.rows.add([callLog]).draw();
            callLog = [];
          }
        });
      });
    });
  });
}