$(document).ready(function() {
  var isOnFave = false;
  var userID;
  //sub_id is userID
  // TODO: handle blocking extra clicks so they don't favorite/delete the wrong picture
  //TODO: handle email-less users: disable addToFavoritesButton, getFavesButton, radio "mode"
  // TODO: handle situation where they have no faves yet
  // TODO: handle isOnFave being true and then immediately calling getFaves because the user id wouldn't be set yet



for (var i = 0; i < 10; i++){
  $("#multipleCatsDiv").append($("<div class=\"catImageDiv\"></div>"));
}

/*
// TODO: figure out how to handle empty catsNumberInput

userID has three modes: unset, empty, and set
  unset: undefined. only happens on first opening of page. Afterwards, a function asks the browser what the userID is. If the user is not signed in, userID is set to an empty string. Otherwise UserID is set to a unique UserID.
  empty: empty string. Means user is not logged in to Chrome
  set: the user's ID

local storage on open:
  multipleBoolean:
    if true: multiMode();
    if false: singleMode();
    if not set: singleMode();
  faveBoolean:
    if true: getFaveOnClick;
    if false: getRandOnClick;
    if not set: getRandOnClick;
  numberOfCats: apply to number input or leave blank if not set or set to 0
  imageSize: apply to imageSizeSlider
  userID:
    if one is saved, set it to userID global variable
    else: run the function that gets the userID and set it to userID

local storage on close:
  multipleBoolean:
    true if: numberMode is "many"
    else false
  faveBoolean:
    set as isOnFave
  numberOfCats: apply to number input, default 0 if not there
  imageSize: from imageSizeSlider
  userID: save userID


radio listener:
  when changed, run singleMode() or run multiMode()

slider listener:
  when changed, changeImageSize()

function singleMode(){
  howManyCatsSlider hide
  sizeSlider hide
  make sure radio "number" is "one" and not "many"
  show singleCatDiv
  hide multipleCatsDiv
  hide catsNumberInput
}

function multiMode(){
  howManyCatsSlider show
  sizeSlider show
  make sure radio "number" is "many" and not "one"
  hide singleCatDiv
  show multipleCatsDiv
  show catsNumberInput
}

getFaveOnClick:
  isOnFave = true;
  setDivs();

getRandOnClick:
  isOnFave = false;
  setDivs();

function doRandomCats(){
  getRandomCats(getCatLimit());
}

function setDivs(){

}

function getRandomCats(catLimit){
  //(need to update get parameters to include catLimit)

  //don't include ones that are in favorites
}

function getARandomCAt(){
//figure this out w/o code duplication
}

function replaceFavesInRandom(){
  getFaveIds;


}

function getCatLimit(){
if on multipleCatsMode:
  if there is no number in catsNumberInput:
    return 10;
  else:
    return catsNumberInput number
else:
  return 1;

}

function getFaveCats(){
isOnFave = true;
//(need to update get parameters to include limit: numberOfCats from catsNumberInput)

}

function getFaveCatIDs(){

}

function responsesToImages(responses){
  take responses and apply them either to singleCatDiv or multipleCatsDiv depending on radio button

  if multiple:
    create the number of divs from catsNumber input
    add class imageCard to each
    changeImageSize()
}

function changeImageSize(){
  var dimensions = get slider value
  change css of imageCard class to height = dimensions, width = dimensions
}
*/























  //old code to return to
  // getRandomCat();
  // var userID;
  // chrome.identity.getProfileUserInfo(function(userInfo) {
  //   userID = JSON.stringify(userInfo["id"]);
  //   userID = userID.replace(/"/g, "");
  //   if (userID === "") {
  //     $("#addToFavoritesButton").attr("disabled", true);
  //     $("#getFavoritesButton").attr("disabled", true);
  //   }
  // });
  //
  // //workaround to avoid code duplication and having to make a deep copy of an object
  // function getSettings() {
  //   return {
  //     "async": true,
  //     "crossDomain": true,
  //     "headers": {
  //       "content-type": "application/json",
  //       "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
  //     },
  //     "processData": false,
  //   }
  // }
  //
  // function getRandomCat() {
  //   var settings = getSettings();
  //   settings.url = "https://api.thecatapi.com/v1/images/search";
  //   settings.method = "GET";
  //
  //   $.ajax(settings).done(function(response) {
  //     var firstResponse = response[0];
  //     $("#currentCat").attr("src", firstResponse["url"]);
  //     $("#currentCat").attr("alt", firstResponse["id"]);
  //   });
  // }
  //
  // $("#newCatButton").click(function() {
  //   getRandomCat();
  //   $("#currentCat").show();
  //   $("#addToFavoritesButton").show();
  //   $("#getFavoritesButton").show();
  //   document.getElementById("favesList").innerHTML = "";
  // });
  //
  // $("#addToFavoritesButton").click(function() {
  //   var currentImageID = $("#currentCat").attr("alt");
  //   var settings = getSettings();
  //   settings.url = "https://api.thecatapi.com/v1/favourites";
  //   settings.method = "POST";
  //   settings.data = "{\"image_id\":\"" + currentImageID + "\",\"sub_id\":\"" + userID + "\"}";
  //
  //   $.ajax(settings)
  //     .done(function(response) {
  //       //TODO: tell them that it's been added
  //       getRandomCat();
  //     })
  //     .fail(function(xhr, ajaxOptions, thrownError) {
  //       var error = JSON.parse(xhr.responseText);
  //       if (error.message.includes("DUPLICATE_FAVOURITE")) {
  //         //TODO: tell them that it's already in there
  //         console.log("duplicate");
  //       }
  //     });
  // });
  //
  // $("#getFavoritesButton").click(function() {
  //   // TODO: shuffle the favorites`
  //   var settings = getSettings();
  //   settings.url = "https://api.thecatapi.com/v1/favourites?sub_id=" + userID;
  //   settings.method = "GET";
  //
  //   $.ajax(settings).done(function(response) {
  //     var favesList = document.getElementById("favesList");
  //     favesList.innerHTML = "";
  //     //set this so that it only works if there are favorites to show and the response was SUCCESSFUL
  //     $("#currentCat").hide();
  //     $("#addToFavoritesButton").hide();
  //     $("#getFavoritesButton").hide();
  //     for (i = 0; i < response.length; i++) {
  //       var faveResponse = response[i];
  //
  //       var div = document.createElement("DIV");
  //       div.classList.add("faveCard");
  //       div.id = faveResponse["id"];
  //       favesList.appendChild(div);
  //
  //       var btn = document.createElement("BUTTON");
  //       btn.classList.add("deleteButton");
  //       btn.innerHTML = "x";
  //       div.appendChild(btn);
  //
  //       var img = document.createElement("IMG");
  //       img.src = faveResponse["image"]["url"];
  //       img.id = faveResponse["image_id"];
  //       div.appendChild(img);
  //
  //     }
  //
  //     $(".deleteButton").hide();
  //
  //     $(".faveCard").mouseover(function(){
  //       $(this).children(".deleteButton").show();
  //     });
  //
  //     $(".faveCard").mouseout(function(){
  //       $(this).children(".deleteButton").hide();
  //     });
  //
  //     $(".deleteButton").click(function() {
  //       var parentElement = $(this).parent();
  //       parentElement.hide();
  //       var deleteSettings = getSettings();
  //       deleteSettings.url = "https://api.thecatapi.com/v1/favourites/" + parentElement.attr("id");
  //       deleteSettings.method = "DELETE";
  //       $.ajax(deleteSettings).done(function(response) {
  //         // TODO: inform them of the deletion
  //       });
  //     });
  //   });
  // });


})
