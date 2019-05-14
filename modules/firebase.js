import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyD859JZHYRGQfalwZZjQEk8e0s8EBAycaM",
    authDomain: "videochat-84e5a.firebaseapp.com",
    databaseURL: "https://videochat-84e5a.firebaseio.com",
    projectId: "videochat-84e5a",
    storageBucket: "videochat-84e5a.appspot.com",
    messagingSenderId: "592854475519"
  };
var VCApp = firebase.initializeApp(config);
module.exports.VCApp = VCApp.database();