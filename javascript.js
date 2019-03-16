$(document).ready(function() {
  //sub_id is userID
  // TODO: handle blocking extra clicks so they don't favorite/delete the wrong picture
  // TODO: get local storage so that their choice of which mode to start in is saved
  //TODO: handle email-less users: disable addToFavoritesButton, getFavesButton, radio "mode"
  // TODO: handle situation where they have no faves yet

var multDiv = $("#multipleCatsDiv");

for (var i = 0; i < 10; i++){
  multDiv.append($("<div class=\"catImageDiv\"></div>"));
}

/*
  local storage on open:
  multipleBoolean:
    if true: multiMode();
    if false: singleMode();
  faveBoolean:
    if true: getFaveCats();
    if false: getRandomCats();
  numberOfCats: apply to number input
  imageSize: apply to imageSizeSlider

  local storage on close:
  multipleBoolean:
    true if: numberMode is "many"
    else false
  faveBoolean:
    if true: getFaveCats();
    if false: getRandomCats();
  numberOfCats: apply to number input, default 10 if not there
  imageSize: from imageSizeSlider


radio listener:
  when changed, run singleMode() or run multiMode()

slider listener:
  when changed, run singleMode() or run multiMode()

get local storage's most recent setting and apply it to the sliders and the radio buttons and the number input
put listeners on each of them so that when they change, the new info is saved in local storage ?? or only when tab closed?

function singleMode(){
howManyCatsSlider disabled
sizeSlider disabled
make sure radio "number" is "one"
show singleCatDiv
hide multipleCatsDiv
hide catsNumberInput
}

function multiMode(){
howManyCatsSlider enabled
sizeSlider enabled
make sure radio "number" is "many"
hide singleCatDiv
show multipleCatsDiv
show catsNumberInput
}

function getRandomCats(numberOfCats){
  //(need to update get parameters to include limit: numberOfCats from catsNumberInput)
  //don't include ones that are in favorites
  just return responses
}

function getFaveCats(numberOfCats){
//(need to update get parameters to include limit: numberOfCats from catsNumberInput)
just return responses

}

function responsesToImages(responses){
take responses and apply them either to singleCatDiv or multipleCatsDiv
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
