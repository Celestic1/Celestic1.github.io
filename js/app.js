// (optional) add server code here
var SERVER_BASE_URL = 'https://telemedicineapp.herokuapp.com/';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
  return res.json()
}).then(function(res) {
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeFirebase();
  initializeSession();
}).catch(handleError);

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }

var callerName = "";
var publisherName = "";
function initializeSession() {

  var session = OT.initSession(apiKey, sessionId);
  

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
      callerName = event.stream.name;
      let r = confirm(callerName + " is trying to start a call with you. Accept?");
      if (r == true){
        getUserInfo();
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

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('Doctors/' + user.uid).on('value', (snapshot) => {
        snapshot.forEach((child) => {
          if(child.key == 'name'){
            publisherName = child.val();
          }
        });
      });
    } else {
      console.log("User not signed in.");
    }
  });
}


function getUserInfo(){
  var database = firebase.database();
  var ref = database.ref().child("Users");
  currUID = "";
  ref.on('value', (snapshot) => {
    snapshot.forEach((child) => {
      uid = child.key;
      firebase.database().ref('Users/' + uid + '/name').on('value', (snapchild) => {
          if(snapchild.val() == callerName){
              currUID = uid;
          }   
      });
    });
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

function logCall(){

}
