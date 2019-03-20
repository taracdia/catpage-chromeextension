$(document).ready(function() {
  /*
      // TODO: handle situation where they have no faves yet
      // TODO: handle situation where they ask for more cat images than can be provided (because favorited too many (so get random can't get enough to exit the do while loop) or don't have enough favorites)
      // TODO: handle duplicate clicks from waiting for load
  */
  /*
  sub_id in API is userID in local storage

  userID has three modes: unset, empty, and set
    unset: undefined. Means that the user has not used the extension while signed in to chrome
    empty: empty string. Means user is not logged in to Chrome
    set: the user's ID
  */
  //initial setup
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
    //if they hit the singleCatDiv button or the first multicatdiv button, will need to prevent them from hitting the button on the other one's side
    //add already deleted button?
    if (typeof cat === "undefined") {
      div.hide();
      console.log("cat is undefined");
    } else {
      var btn = div.children("button");
      var img = div.children("img");

      if (cat["image"]) {
        img.attr("src", cat["image"]["url"]);
        //     change button to delete type**
        btn.addClass("deleteButton");
        btn.removeClass("addFaveButton");
        btn.removeClass("deleteButton");
        btn.click(function() {
          var settings = getSettings();
          settings.url = "https://api.thecatapi.com/v1/favourites/" + cat["id"];
          settings.method = "DELETE";
          $.ajax(settings).done(function(response) {
            // TODO: inform them of the deletion
            div.hide();
          });
        });
      } else {
        img.attr("src", cat["url"]);
        btn.removeClass("deleteButton");
        if (cat["favourite"]) {
          //change button to already in faves button
          btn.addClass("alreadyFavedButton");
          btn.removeClass("addFaveButton");
          btn.attr("disabled", true);
        } else {
          //     change button to addFaves type**
          btn.addClass("addFaveButton");
          btn.removeClass("alreadyFavedButton");

          btn.click(function() {
            var settings = getSettings();
            settings.url = "https://api.thecatapi.com/v1/favourites";
            settings.method = "POST";
            settings.data = "{\"image_id\":\"" + cat["id"] + "\",\"sub_id\":\"" + localStorage.userID + "\"}";
            $.ajax(settings)
              .done(function(response) {
                // TODO: inform them it's been added
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

  function getRandomCats(catLimit) {
    localStorage.faveBoolean = false;

    var settings = getSettings();
    settings.method = "GET";
    settings.url = "https://api.thecatapi.com/v1/images/search?limit=" + catLimit;
    //delete this later
    settings.url += "&order=asc";
    if (localStorage.userID) {
      settings.url += "&sub_id=" + localStorage.userID;
    }

    $.ajax(settings).done(function(response) {
      setDivs(response);
      console.log(settings);
      console.log(response);
    });
  }

  function shuffleArray(inputArray, catLimit) {
    var outputArray = [];
    var counter = 0;

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
    var catNumber = 5; //default
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
});
