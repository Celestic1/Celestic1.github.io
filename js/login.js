function login(){

  initializeFirebase();

  if(firebase.auth().currentUser) {
    firebase.auth().signOut();
  } 
  // var userEmail = document.getElementById("email_field").value;
  // var userPass = document.getElementById("password_field").value;

  // development purposes
  var userEmail = "gregoryhouse@gmail.com"
  var userPass = "123456";

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
  .then(function(user){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('Doctors/' + user.uid).on('value', (snapshot) => {
          snapshot.forEach((child) => {
            if(child.key == 'name'){
              var publisherName = child.val();
              localStorage.setItem('publisher_name', publisherName);
              (function wait(){
                if(localStorage.getItem('publisher_name') == publisherName){
                  window.location="videocall.html";
                } else {
                  setTimeout(one, 30);
                }
              })();
            }
          });
        });
      } else {
        console.log("User not signed in.");
      }
    });
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
      return;
    } else {
      alert(errorMessage);
      return;
    }
  });
}

function initializeFirebase(){
  var config = {
    apiKey: "AIzaSyD859JZHYRGQfalwZZjQEk8e0s8EBAycaM",
    authDomain: "videochat-84e5a.firebaseapp.com",
    databaseURL: "https://videochat-84e5a.firebaseio.com",
    projectId: "videochat-84e5a",
    storageBucket: "videochat-84e5a.appspot.com",
    messagingSenderId: "592854475519"
  };
  firebase.initializeApp(config);
}
