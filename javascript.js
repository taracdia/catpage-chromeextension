$(document).ready(function() {
  // TODO: handle situation where they have no faves yet
  // TODO: handle situation where they ask for more cat images than can be provided (because favorited too many (so get random can't get enough to exit the do while loop) or don't have enough favorites)
  // TODO: handle duplicate clicks from waiting for load

  /*
  sub_id in API is userID in local storage

  userID has three modes: unset, empty, and set
    unset: undefined. Means that the user has not used the extension while signed in to chrome
    empty: empty string. Means user is not logged in to Chrome
    set: the user's ID
  */

  for (var i = 0; i < 100; i++) {
    var div = $("<div class='imageCard'></div>");
    var btn = $("<button class='imageButton'>+</button>");
    var img = $("<img>");

    $("#multipleCatsDiv").append(div);
    div.append(btn);
    div.append(img);
  }

  $(".imageButton").hide();

  $(".imageCard").mouseover(function() {
    var btn = $(this).children("button");
    btn.show();
  });

  $(".imageCard").mouseout(function() {
    var btn = $(this).children("button");
    btn.hide();
  });

  //workaround to avoid code duplication and having to make a deep copy of an object
  function getSettings() {
    return {
      "async": true,
      "crossDomain": true,
      "headers": {
        "content-type": "application/json",
        "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
      },
      "processData": false,
    }
  }

  //-----Set up with local storage-----
  if (typeof localStorage.userID === "undefined") {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      var userID = JSON.stringify(userInfo["id"]);
      userID = userID.replace(/"/g, "");
      if (userID === "") {
        $("#newCatsButton").attr("disabled", true);
        $("#getFavesButton").attr("disabled", true);
        $(".imageButton").attr("disabled", true);
      } else {
        localStorage.userID = userID;
      }
    });
  }

  if (localStorage.multipleBoolean && localStorage.multipleBoolean === "true") {
    multiMode();
  } else {
    singleMode();
  }

  if (localStorage.numberOfCats) {
    $("#catsNumberInput").val(localStorage.numberOfCats);
  }

  if (localStorage.imageSize) {
    $("#imageSizeSlider").val(localStorage.imageSize);
  }

  if (localStorage.faveBoolean && localStorage.faveBoolean === "true") {
    getFaveCats(getCatLimit());
  } else {
    getRandomCats(getCatLimit());
  }

  changeImageSize();

  //-----temp-------
  $("#showCookies").click(function() {
    console.log("imageSize is " + localStorage.imageSize);
    console.log("faveBoolean is " + localStorage.faveBoolean);
    console.log("numberOfCats is " + localStorage.numberOfCats);
    console.log("userID is " + localStorage.userID);
    console.log("multipleBoolean is " + localStorage.multipleBoolean);
  })

  $("#resetCookies").click(function() {
    localStorage.clear();
  })
  //-----temp------
  //--Listeners--
  $("#imageSizeSlider").change(function() {
    localStorage.imageSize = $("#imageSizeSlider").val();
    changeImageSize();
  });

  $("input[name=numberMode]:radio").change(function() {
    if ($("input[name='numberMode']:checked").val() === "one") {
      singleMode();
    } else {
      multiMode();
    }
  });

  function singleMode() {
    $("#getFavesButton").text("Get Fave");
    $("#newCatsButton").text("Get New Cat");
    localStorage.multipleBoolean = false;
    $("[name='numberMode']").removeAttr("checked");
    $("input[name=numberMode][value=one]").prop("checked", true);
    $("#catsNumberInput").hide();
    $("#sliderContainer").hide();
    $("#multipleCatsDiv").hide();
    $("#singleCatDiv").show();
  }

  function multiMode() {
    console.log("multiMode");

    $("#getFavesButton").text("Get Faves");
    $("#newCatsButton").text("Get New Cats");
    localStorage.multipleBoolean = true;
    $("[name='numberMode']").removeAttr("checked");
    $("input[name=numberMode][value=many]").prop("checked", true);
    $("#catsNumberInput").show();
    $("#sliderContainer").show();
    $("#multipleCatsDiv").show();
    $("#singleCatDiv").hide();
  }

  $("#getFavesButton").click(function() {
    getFaveCats(getCatLimit());
  });


  $("#newCatsButton").click(function() {
    getRandomCats(getCatLimit);
  });


  function setDivs(array) {
    changeDiv($("#singleCatDiv"), array[0]);

    for (var i = 0; i < 100; i++) {
      var div = $("#multipleCatsDiv div").eq(i);
      if (i < array.length) {
        div.show();
        changeDiv(div, array[i]);
      } else {
        div.hide();
      }
    }
  }

  function changeDiv(div, cat) {
    console.log("changeDiv")

    if (typeof cat === "undefined") {
      div.hide();
      console.log("cat is undefined");
    } else {
      var btn = div.children("button");
      var img = div.children("img");
      img.attr("src", cat["url"]);
      img.attr("id", cat["id"]);

      if (cat["fave_id"]) {
        img.attr("alt", cat["fave_id"]);
        //     change button to delete type**
        btn.addClass("deleteButton");
        btn.removeClass("addFaveButton");
        btn.click(function(){

        });

      } else {
        img.attr("alt", "");
        btn.removeClass("deleteButton");
        btn.addClass("addFaveButton");
        // if cat is already in faves{
        //   //change button to already in faves button
        // }else {
        //   //     change button to addFaves type**
        // }
      }
    }
  }

  function getRandomCats(catLimit) {
    localStorage.faveBoolean = false;

    var settings = getSettings();
    settings.method = "GET";
    settings.url = "https://api.thecatapi.com/v1/images/search?limit=" + catLimit;
    if (localStorage.userID) {
      settings.url += "&sub_id=" + localStorage.userID;
    }

    $.ajax(settings).done(function(response) {
      setDivs(response);
    });
  }

  function formatFave(fave) {
    var formattedFave = fave["image"];
    formattedFave["fave_id"] = fave["id"]
    return formattedFave;
  }

  function shuffleArray(inputArray, catLimit) {
    var outputArray = [];
    var checkArray = [];
    var counter = 0;

    if (inputArray.length < catLimit) {
      catLimit = inputArray.length;
    }

    do {
      var fave = inputArray[Math.floor(Math.random() * inputArray.length)];
      if (jQuery.inArray(fave, checkArray) === -1) {
        outputArray.push(formatFave(fave));
        checkArray.push(fave);

        counter++;
      }
    } while (counter < catLimit);

    return outputArray;
  }

  function getFaveCats(catLimit) {
    localStorage.faveBoolean = true;

    var settings = getSettings();
    settings.url = "https://api.thecatapi.com/v1/favourites?sub_id=" + localStorage.userID;
    settings.method = "GET";

    $.ajax(settings).done(function(response) {
      var faveArray = shuffleArray(response, catLimit);
      setDivs(faveArray);
    });
  }

  function getCatLimit() {
    var catNumber = 15; //default is 10
    var numberInput = $("#catsNumberInput").val();

    if (numberInput > 0 && numberInput <= 100) {
      catNumber = numberInput;
    }

    localStorage.numberOfCats = catNumber;
    return catNumber;
  }

  function changeImageSize() {
    var dimensions = $("#imageSizeSlider").val();
    $(".imageCard").height(dimensions);
    $(".imageCard").width(dimensions);
  }









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
  //   settings.data = "{'image_id':'" + currentImageID + "','sub_id':'" + userID + "'}";
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
