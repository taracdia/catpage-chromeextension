$(document).ready(function() {
      // TODO: handle situation where they have no faves yet
  /*
  sub_id in API is userID in local storage

  userID has three modes: unset, empty, and set
    unset: undefined. Means that the user has not used the extension while signed in to chrome
    empty: empty string. Means user is not logged in to Chrome
    set: the user's ID
  */
  //initial setup
  for (var i = 0; i < 100; i++) {
    var div = $("<div></div>");
    if (i === 0) {
      div.attr("id", "firstMultDiv");
    } else {
      div.addClass("multiModeCard");
    }
    var btn = $("<button class='imageButton'>+</button>");
    var img = $("<img>");
    $("#catContainer").append(div);
    div.append(btn);
    div.append(img);
  }

  $(".imageButton").hide();

  $("#catContainer div").mouseover(function() {
    var btn = $(this).children("button");
    btn.show();
  });

  $("#catContainer div").mouseout(function() {
    var btn = $(this).children("button");
    btn.hide();
  });

  // $("#buttonBar").css("visibility", "hidden");
  //
  // $(document).mouseover(function() {
  //   $("#buttonBar").css("visibility", "visible");
  // });
  //
  // $(document).mouseout(function() {
  //   $("#buttonBar").css("visibility", "hidden");
  // });

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

  //-----local storage settings-----
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

  if (localStorage.numberOfCats) {
    $("#catsNumberInput").val(localStorage.numberOfCats);
  }

  if (localStorage.imageSize) {
    $("#imageSizeSlider").val(localStorage.imageSize);
  }

  if (localStorage.faveBoolean && localStorage.faveBoolean === "true") {
    getFaveCats();
  } else {
    getRandomCats();
  }

  if (localStorage.multipleBoolean && localStorage.multipleBoolean === "true") {
    multiMode();
  } else {
    singleMode();
  }

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
    console.log("duplicate");

    localStorage.imageSize = $("#imageSizeSlider").val();
    changeImageSize();
  });

  $("input[name=numberMode]:radio").change(function() {
    console.log("duplicate");

    if ($("input[name='numberMode']:checked").val() === "one") {
      singleMode();
    } else {
      multiMode();
    }
  });

  $("#getFavesButton").click(function() {
    console.log("duplicate");

    getFaveCats();
  });

  $("#newCatsButton").click(function() {
    console.log("duplicate");

    getRandomCats();
  });
  //-----------

  function singleMode() {
    console.log("singleMode");

    // if (!($("firstMultDiv").hasClass("occupied"))){
    //   getFaveCats();
    // }
    $("#getFavesButton").text("Get Fave");
    $("#newCatsButton").text("Get New Cat");
    localStorage.multipleBoolean = false;
    $("[name='numberMode']").removeAttr("checked");
    $("input[name=numberMode][value=one]").prop("checked", true);
    $("#catsNumberInput").hide();
    $("#sliderContainer").hide();

    $("#firstMultDiv").removeClass("multiModeCard");
    $("#firstMultDiv").removeAttr("style");
    $(".multiModeCard").addClass("hidden");
  }

  function multiMode() {
    console.log("multiMode");

    changeImageSize();
    $("#getFavesButton").text("Get Faves");
    $("#newCatsButton").text("Get New Cats");
    localStorage.multipleBoolean = true;
    $("[name='numberMode']").removeAttr("checked");
    $("input[name=numberMode][value=many]").prop("checked", true);
    $("#catsNumberInput").show();
    $("#sliderContainer").show();

    $("#firstMultDiv").addClass("multiModeCard");
    $(".multiModeCard").removeClass("hidden");
  }

  function setDivs(array) {
    console.log("setDivs");

    console.log(array);
    // if (typeof array[0] === "undefined") {
    //   alert("You don't have any favorites!");
    //   getRandomCats();
    // } else {
      for (var i = 0; i < 100; i++) {
        var div = $("#catContainer div").eq(i);
        if (i < array.length) {
          div.addClass("occupied");
          changeDiv(div, array[i]);
        } else {
          div.removeClass("occupied");
        }
      }
  }

  function changeDiv(div, cat) {
    console.log("changeDiv");

    if (typeof cat === "undefined") {
      //might be unnecessary now?
      alert("cat is undefined");
    } else {
      var btn = div.children("button");
      var img = div.children("img");

      btn.attr("disabled", false);

      if (cat["image"]) {
        img.attr("src", cat["image"]["url"]);
        btn.addClass("deleteButton");
        btn.removeClass("addFaveButton alreadyFavedButton");
        btn.click(function() {
          var settings = getSettings();
          settings.url = "https://api.thecatapi.com/v1/favourites/" + cat["id"];
          settings.method = "DELETE";
          $.ajax(settings).done(function(response) {
            // TODO: inform them of the deletion
            // TODO: switch to addtofaves so they can undo deletion
            // div.removeClass("occupied");
          });
        });
      } else {
        img.attr("src", cat["url"]);
        btn.removeClass("deleteButton");
        if (cat["favourite"]) {
          btn.addClass("alreadyFavedButton");
          btn.removeClass("addFaveButton");
          btn.attr("disabled", true);
        } else {
          btn.addClass("addFaveButton");
          btn.removeClass("alreadyFavedButton");

          btn.click(function() {
            var settings = getSettings();
            settings.url = "https://api.thecatapi.com/v1/favourites";
            settings.method = "POST";
            settings.data = "{\"image_id\":\"" + cat["id"] + "\",\"sub_id\":\"" + localStorage.userID + "\"}";
            $.ajax(settings)
              .done(function(response) {
                //TODO: instead of alreadyFavedButton, let them delete the fave
                btn.addClass("alreadyFavedButton");
                btn.removeClass("addFaveButton");
                btn.removeClass("deleteButton");
                btn.attr("disabled", true);
              })
              .fail(function(xhr, ajaxOptions, thrownError) {
                var error = JSON.parse(xhr.responseText);
                if (error.message.includes("DUPLICATE_FAVOURITE")) {
                  //TODO: tell them that it's already in there
                  console.log("duplicate");
                }
              });
          });
        }
      }
    }
  }

  function getRandomCats() {
    console.log("getRandomCats");

    localStorage.faveBoolean = false;

    var settings = getSettings();
    settings.method = "GET";
    settings.url = "https://api.thecatapi.com/v1/images/search?limit=" + getCatLimit();
    //delete this later
    // settings.url += "&order=asc";
    if (localStorage.userID) {
      settings.url += "&sub_id=" + localStorage.userID;
    }

    $.ajax(settings).done(function(response) {
      setDivs(response);
    });
  }

  function shuffleArray(inputArray) {
    console.log("shuffleArray");
    var outputArray = [];
    var counter = 0;
    var catLimit = getCatLimit();

    if (inputArray.length < catLimit) {
      catLimit = inputArray.length;
    }

    do {
      var fave = inputArray[Math.floor(Math.random() * inputArray.length)];
      if (jQuery.inArray(fave, outputArray) === -1) {
        outputArray.push(fave);
        counter++;
      }
    } while (counter < catLimit);

    return outputArray;
  }

  function getFaveCats() {
    console.log("getFaveCats");

    localStorage.faveBoolean = true;

    var settings = getSettings();
    settings.url = "https://api.thecatapi.com/v1/favourites?sub_id=" + localStorage.userID;
    settings.method = "GET";

    $.ajax(settings).done(function(response) {
      setDivs(shuffleArray(response));
    });
  }

  function getCatLimit() {
    console.log("getCatLimit");

    var catNumber = 5; //default
    var numberInput = $("#catsNumberInput").val();

    //API has a maximum of 100 per request
    if (numberInput > 0 && numberInput <= 100) {
      catNumber = numberInput;
    }

    localStorage.numberOfCats = catNumber;
    return catNumber;
  }

  function changeImageSize() {
    console.log("changeImageSize");

    var dimensions = $("#imageSizeSlider").val();
    $("#catContainer div").height(dimensions);
    $("#catContainer div").width(dimensions);
  }
});
