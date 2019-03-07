chrome.identity.getProfileUserInfo(function(userInfo) {
  console.log(JSON.stringify(userInfo));
});





$(document).ready(function() {
  //// TODO: add users so their favorites are what's shown OR make it so most popular cats are what's shown if I can't get unique IDs for my users
  // TODO: make it possible to delete favorites
  var currentImageID;
  getRandomCat();

  $("#addToFavoritesButton").click(function() {
    //TODO: put in a way to only add ones that haven't been added already
    //TODO: tell them that it's been added or that it was already in there
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.thecatapi.com/v1/favourites",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
      },
      "processData": false,
      "data": "{\"image_id\":\"" + currentImageID + "\"}"
    }

    $.ajax(settings).done(function(response) {
      console.log(response);
      //TODO: get a new cat
    });


  });

  $("#getFavoritesButton").click(function() {
    // TODO: shuffle the favorites`
    //TODO: hide main picture and get favorites button and add to favorites button
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.thecatapi.com/v1/favourites",
      "method": "GET",
      "headers": {
        "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
      }
    }

    $.ajax(settings).done(function(response) {
      console.log(response);
      var favesList = document.getElementById("favesList");
      favesList.innerHTML = "";
      for (i = 0; i < response.length; i++) {

        var div = document.createElement("DIV");
        div.classList.add("faveCard");
        var img = document.createElement("IMG");
        img.src = response[i]["image"]["url"];
        favesList.appendChild(div);
        div.appendChild(img);
      }
      $(".faveCard").click(function() {
        alert("delete");
      })
    });
  });

  $("#newCatButton").click(function() {
    //TODO: show main picture and get favorites button and add to favorites button

    document.getElementById("favesList").innerHTML = "";
    getRandomCat();
  });

  function getRandomCat() {
    $.ajax({
      url: "https://api.thecatapi.com/v1/images/search",
      type: "GET",
      success: function(result) {
        $("#currentImage").attr("src", result[0]["url"]);
        currentImageID = result[0]["id"];
        console.log(currentImageID);
      }
    })
  }
})
