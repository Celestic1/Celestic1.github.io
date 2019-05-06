firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("welcome_text").innerHTML = user.email;
  }
});

function logout(){
  firebase.auth().signOut();
  location="/Users/raymondliang/Desktop/VideoChatJS/login.html";
}