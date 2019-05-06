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
    window.location="https://github.com/Celestic1/testsite/videocall.html";
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
