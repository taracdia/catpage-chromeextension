$(document).ready(function() {
  // TODO: handle blocking extra clicks so they don't favorite/delete the wrong picture
  // TODO: handle situation where they have no faves yet
  // TODO: handle situation where they ask for more cat images than can be provided (because favorited too many (so get random can't get enough to exit the do while loop) or don't have enough favorites)

  /*
  sub_id in API is userID in local storage

  userID has three modes: unset, empty, and set
    unset: undefined. Means that the user has not used the extension while signed in to chrome
    empty: empty string. Means user is not logged in to Chrome
    set: the user's ID
  */

for (var i = 0; i < 10; i++){
  $("#multipleCatsDiv").append($("<div class=\"imageCard\"></div>"));
}

//-----Set up with local storage-----
  if (typeof localStorage.userID !== "undefined"){
    //run the function to check for ID from browser
    //if it's empty:
        //TODO: handle email-less users: disable addToFavoritesButton, getFavesButton, radio "mode"
    //else:
      //save the ID to userID in localStorage
  }

  if(localStorage.multipleBoolean && localStorage.multipleBoolean === "true"){
    multiMode();
  } else {
    singleMode();
  }

if(localStorage.numberOfCats){
  $("#catsNumberInput").val(localStorage.numberOfCats);
}

if(localStorage.imageSize){
  $("#imageSizeSlider").val(localStorage.imageSize);
}

if(localStorage.faveBoolean && localStorage.faveBoolean === "true"){
  getFaveOnClick();
} else {
  getRandOnClick();
}

changeImageSize();

//-----temp-------
$("#showCookies").click(function(){
  console.log("imageSize is " + localStorage.imageSize);
  console.log("faveBoolean is " + localStorage.faveBoolean);
  console.log("numberOfCats is " + localStorage.numberOfCats);
  console.log("userID is " + localStorage.userID);
  console.log("multipleBoolean is " + localStorage.multipleBoolean);
})

$("#resetCookies").click(function(){
  localStorage.clear();
})

//--Listeners--
$("#imageSizeSlider").change(function(){
  console.log("slider changed")

  localStorage.imageSize = $("#imageSizeSlider").val();
  changeImageSize();
});

$("input[name=numberMode]:radio").change(function(){
  console.log("radio changed")

  if ($("input[name=\"numberMode\"]:checked").val() === "one"){
    singleMode();
  } else {
    multiMode();
  }
});

function singleMode(){
  console.log("singleMode")

  $("#getFavesButton").text("Get Fave");
  $("#newCatsButton").text("Get New Cat");
  localStorage.multipleBoolean = false;
  $("[name=\"numberMode\"]").removeAttr("checked");
  $("input[name=numberMode][value=one]").prop("checked", true);
  $("#catsNumberInput").hide();
  $("#sliderContainer").hide();
  $("#multipleCatsDiv").hide();
  $("#singleCatDiv").show();
}

function multiMode(){
  console.log("multiMode")

  $("#getFavesButton").text("Get Faves");
  $("#newCatsButton").text("Get New Cats");
  localStorage.multipleBoolean = true;
  $("[name=\"numberMode\"]").removeAttr("checked");
  $("input[name=numberMode][value=many]").prop("checked", true);
  $("#catsNumberInput").show();
  $("#sliderContainer").show();
  $("#multipleCatsDiv").show();
  $("#singleCatDiv").hide();
}

function getFaveOnClick(){
  console.log("getFaveOnClick")

  localStorage.faveBoolean = true;
  setDivs(shuffleArray(getFaveCats(getCatLimit())));
}

function getRandOnClick(){
  console.log("getRandOnClick")

  localStorage.faveBoolean = false;
  setDivs(getRandomCats(getCatLimit()));
}

function setDivs(array){
  console.log("setDivs")

//   singleCatDiv.innerHTML = ""
//   multipleCatsDiv.innerHTML = ""
//   createResponsiveDiv(singleCatDiv, array[0]);
//
//   for (var i = 0; i < array.length; i++){
//     create div
//     createResponsiveDiv(div, array[i]);
//     add div to multipleCatsDiv
//     add class="imageCard" to div
//   }
}

function createResponsiveDiv(div, cat){
  console.log("createResponsiveDiv")

//   add button to div
//   add img to div
//   img add src as cat["url"];
//   img add id as cat["id"];
//   if cat["fave_id"] exists:
//     set it to img's alt
//     button is delete type**
//   else:
//     set img's alt to empty string
//     button is addFaves type**
}

function getRandomCats(catLimit){
  console.log("getRandomCats")

//   var catsArray = [];
//   {
//     //pass sub_id IF it is set
//     get a random cat
//     if it has include_favourite = 1:
//       skip
//     else:
//       add it to catsArray
//   } do while catsArray.length < catLimit
//   return catsArray;
}

function getFaveCats(catLimit){
  console.log("getFaveCats")

//   var outputArray = [];
//   var inputArray = getFaveArray(catLimit);
//   for each cat in inputArray:{
//     make object;
//     object["fave_id"] = cat["id"];
//     object["id"] = cat["image"]["id"];
//     object["url"] = cat["image"]["url"];
//
//     add object to outputArray
//   }
//   return outputArray;
}

function shuffleArray(array){
  console.log("shuffleArray")

//   return shuffledArray;
}

function getFaveArray(catLimit){
  console.log("getFaveArray")

//   //need to put in limit parameter
//   //API
//   return faveArray
}

function getCatLimit(){
  console.log("getCatLimit")

    var catNumber = 10;

    if($("#catsNumberInput").val() > 0){
      catNumber = $("#catsNumberInput").val();
    }

    localStorage.numberOfCats = catNumber;
  return catNumber;
}

function changeImageSize(){
  console.log("changeImageSize")

  var dimensions = $("#imageSizeSlider").val();
  $(".imageCard").height(dimensions);
  $(".imageCard").width(dimensions);
}
























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
  // $("#newCatsButton").click(function() {
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
