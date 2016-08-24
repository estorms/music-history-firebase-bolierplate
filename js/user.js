"use strict";
let firebase = require("./firebaseConfig"),
  provider = new firebase.auth.GoogleAuthProvider();

function logInGoogle() {
    // console.log('logging in, bitches');
    console.log(provider);
    return firebase.auth().signInWithPopup(provider);

}

module.exports = logInGoogle;
