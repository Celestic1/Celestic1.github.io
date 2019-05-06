function login(){

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
    window.location="videocall.html";
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