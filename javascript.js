$(document).ready(function() {
  const REQUEST_LIMIT = 100; //maximum length of the Get responses from the API

  //sub_id in API is userID in local storage

  //initial setup
  for (var i = 0; i < REQUEST_LIMIT; i++) {
    var div = $("<div class='multiModeCard'></div>");
    if (i === 0) {
      div.attr("id", "firstMultDiv");
    }
    $("#catContainer").append(div);
    div.append($("<button class='imageButton'>+</button>"));
  }

  $(".imageButton").hide();

  $("#catContainer div").mouseover(function() {
    $(this).children("button").show()
  });

  $("#catContainer div").mouseout(function() {
    $(this).children("button").hide()
  });

  $("#buttonBar").hide();

  $(document).mouseover(function() {
    $("#buttonBar").show()
  });

  $(document).mouseout(function() {
    $("#buttonBar").hide()
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
    console.log("slider changed");

    localStorage.imageSize = $("#imageSizeSlider").val();
    changeImageSize();
  });

  $("input[name=numberMode]:radio").change(function() {
    console.log("radio changed to " + $("input[name='numberMode']:checked").val());

    if ($("input[name='numberMode']:checked").val() === "one") {
      singleMode();
    } else {
      multiMode();
    }
  });


  $("#getFavesButton").click(getFaveCats);

  $("#newCatsButton").click(getRandomCats);
  //-----------

  function singleMode() {
    console.log("singleMode");

    $("#getFavesButton").text("Get Fave");
    $("#newCatsButton").text("Get New Cat");
    localStorage.multipleBoolean = false;
    $("[name='numberMode']").removeAttr("checked");
    $("input[name=numberMode][value=one]").prop("checked", true);
    $("#catsNumberInput").hide();
    $("#sliderContainer").hide();

    $("#firstMultDiv").removeClass("multiModeCard");
    $("#firstMultDiv").css("height", "").css("width", "");
    $(".multiModeCard").addClass("hidden");
    $("#catContainer").addClass("flexContainer");

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
    $("#catContainer").removeClass("flexContainer");
  }

  function setDivs(array) {
    console.log("setDivs");

    for (var i = 0; i < REQUEST_LIMIT; i++) {
      changeDiv($("#catContainer div").eq(i), array[i]);
    }
  }

  function changeDiv(div, cat) {
    console.log("changeDiv");

    var btn = div.children("button");
    btn.off("click");

    if (typeof cat === "undefined") {
      //hide the div by saying it is not occupied. This tells the css file that it should be hidden
      div.removeClass("occupied");
    } else {
      div.addClass("occupied");
      var imageURL;
      if (cat["image"]) {
        imageURL = cat["image"]["url"];

        btn
          .text("X")
          .addClass("deleteButton")
          .removeClass("addFaveButton")
          .click(function() {
            deleteButtonOnClick($(this), cat["id"], cat["image"]["id"]);
          });
      } else if (cat["favourite"]) {
        imageURL = cat["url"];

        btn
          .text("X")
          .addClass("deleteButton")
          .removeClass("addFaveButton")
          .click(function() {
            deleteButtonOnClick($(this), cat["favourite"]["id"], cat["id"]);
          });
      } else {
        imageURL = cat["url"];

        btn
          .text("+")
          .addClass("addFaveButton")
          .removeClass("deleteButton")
          .click(function() {
            addFaveButtonOnClick($(this), cat["id"]);
          });
      }
      div.css("background-image", "url(" + imageURL + ")");
    }
  }

  function deleteButtonOnClick(button, faveID, imageID) {
    console.log("deleteButtonOnClick");

    var settings = getSettings();
    settings.url = "https://api.thecatapi.com/v1/favourites/" + faveID;
    settings.method = "DELETE";
    $.ajax(settings)
      .done(function(response) {
        console.log(response);

        button
          .text("+")
          .toggleClass("deleteButton addFaveButton")
          .off("click")
          .click(function() {
            addFaveButtonOnClick(button, imageID);
          });
      })
      .fail(handleAjaxErrors);
  }

  function addFaveButtonOnClick(button, imageID) {
    console.log("addFaveButtonOnClick");

    var settings = getSettings();
    settings.url = "https://api.thecatapi.com/v1/favourites";
    settings.method = "POST";
    settings.data = JSON.stringify({
      "image_id": imageID,
      "sub_id": localStorage.userID
    });
    $.ajax(settings)
      .done(function(response) {
        console.log(response);

        button
          .text("X")
          .toggleClass("deleteButton addFaveButton")
          .off("click")
          .click(function() {
            deleteButtonOnClick(button, response["id"], imageID);
          });
      })
      .fail(handleAjaxErrors);
  }

  function handleAjaxErrors() {
    alert("Warning: editing in multiple tabs at once can have unexpected results!");
    if (localStorage.faveBoolean && localStorage.faveBoolean === "true") {
      getFaveCats();
    } else {
      getRandomCats();
    }
  }

  function getRandomCats() {
    console.log("getRandomCats");

    localStorage.faveBoolean = false;

    var settings = getSettings();
    settings.method = "GET";
    settings.url = "https://api.thecatapi.com/v1/images/search?limit=" + getCatLimit();
    if (localStorage.userID) {
      settings.url += "&sub_id=" + localStorage.userID;
    }

    $.ajax(settings).done(function(response) {
      console.log(response);

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
      console.log(response);
      if (response.length === 0) {
        alert("You don't have any favorites!");
        getRandomCats();
      } else {
        setDivs(shuffleArray(response));
      }
    });
  }

  function getCatLimit() {
    console.log("getCatLimit");

    var catNumber = 5; //default
    var numberInput = $("#catsNumberInput").val();
    if (numberInput > 0 && numberInput <= REQUEST_LIMIT) {
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
