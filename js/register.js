firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var currUser = user;
  }
});

function register(){

  var email = document.getElementById("reg_email").value;
  var password = document.getElementById("reg_pass").value;
  var address = document.getElementById("reg_addr").value;
  var phone = document.getElementById("reg_phone").value;
  var name = document.getElementById("reg_name").value;
  var availability = false;

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(auth){
    var userId = auth.user.uid;
    var databaseRef = firebase.database().ref('Users');
    databaseRef.child(userId).set({
        user: name,
        email: email,
        uid: userId,
        phone: phone,
        address: address,
        availability: availability,
        device_token: ""
    })  .then(function() {
      alert('Registration Successful');
      location="/Users/raymondliang/Desktop/VideoChatJS/login.html";
    })
    .catch(function(error) {
      alert('Registration Failed');
    });
  })
  .catch(function(error) {
    alert(error);
  });
}
