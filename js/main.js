"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    login = require("./user");


  var userId = '';

// Using the REST API
function loadSongsToDOM() {
  console.log("Need to load some songs, Buddy");
  $(".uiContainer--wrapper").html(" ");
  db.getSongs()
  .then(function(songData) {
    var idArr = Object.keys(songData);
    idArr.forEach(function(key){
      songData[key].id = key;
    });
    console.log("songobject with id added", songData);
    templates.makeSongList(songData);
  });
}
// loadSongsToDOM(); //<--Move to auth section after adding login btn

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
    let songObj = buildSongObj();
    db.addSong(songObj)
    .then(function(songId){
      console.log('song saved', songId);
      loadSongsToDOM();
    });
});

// Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {
  let songId = $(this).data("edit-id");
  console.log("id?", songId);
  db.getSong(songId)
  .then(function (song){
    return templates.songForm(song, songId);
  })
  .then(function(finishedForm){
    $(".uiContainer--wrapper").html(finishedForm);
  });
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
  songId = $(this).attr("id");
  db.editSong(songObj, songId)
  .then(function (data){
    loadSongsToDOM();
  });
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  let songId = $(this).data("delete-id");
  db.deleteSong(songId)
  .then(function (data){
    loadSongsToDOM();
  });
});


//***************************************************************
// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  console.log("clicked auth");
  login()
  .then(function(result){
    let user = result.user;
    console.log("logged in user", user.uid);
    userId = user.uid;
    loadSongsToDOM();
  });
});

//Make user ID a property on each object added by that user
//****************************************************************

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: userId
  };
  console.log('songObj with user Id', songObj);
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});
