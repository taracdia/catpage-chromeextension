$(document).ready(function() {
  //sub_id is userID
  // TODO: make it possible to delete favorites
  //TODO: handle users who are not logged in to a google account: userID is empty string
  getRandomCat();
  var userID;
  chrome.identity.getProfileUserInfo(function(userInfo) {
    userID = JSON.stringify(userInfo["id"]);
    userID = userID.replace(/"/g, "");
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

  $("#newCatButton").click(function() {
    //TODO: show main picture and get favorites button and add to favorites button
    document.getElementById("favesList").innerHTML = "";
    getRandomCat();
  });

  $("#addToFavoritesButton").click(function() {
    //TODO: put in a way to only add ones that haven't been added already
    //TODO: tell them that it's been added or that it was already in there
    console.log(userID);
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
      "data": "{\"image_id\":\"" + currentImageID + "\",\"sub_id\":\"" + userID + "\"}"
    }
    console.log(settings);

    $.ajax(settings).done(function(response) {
      console.log(response);
      //TODO: get a new cat IF RESPONSE MEANS SUCCESSFUL
      //getRandomCat();
    });

  });

  $("#getFavoritesButton").click(function() {
    // TODO: shuffle the favorites`
    //TODO: hide main picture and get favorites button and add to favorites button
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.thecatapi.com/v1/favourites?sub_id=" + userID,
      "method": "GET",
      "headers": {
        "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
      }
    }
    console.log(settings);

    $.ajax(settings).done(function(response) {
      console.log(response);
      var favesList = document.getElementById("favesList");
      favesList.innerHTML = "";
      for (i = 0; i < response.length; i++) {

        var div = document.createElement("DIV");
        div.classList.add("faveCard");
        var img = document.createElement("IMG");
        img.src = response[i]["image"]["url"];
        img.id = response[i]["image_id"];
        favesList.appendChild(div);
        div.appendChild(img);
        div.id = response[i]["id"];

      }
      $(".faveCard").click(function() {
        var faveID = this.id;
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.thecatapi.com/v1/favourites/" + faveID,
          "method": "DELETE",
          "headers": {
            "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
          }
        }

        $.ajax(settings).done(function(response) {
          console.log(response);
          //// TODO: after delete, refresh list of faves
        });
      })
    });
  });


})
