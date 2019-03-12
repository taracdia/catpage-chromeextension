var settings = {
  "async": true,
  "crossDomain": true,
  "headers": {
    "content-type": "application/json",
    "x-api-key": "d2685ff7-e0ef-437e-8c49-0cc03abf9bbd"
  },
  "processData": false,
}
//getRandomCat
var settings = {
  "url": "https://api.thecatapi.com/v1/images/search",
  "method": "GET",
}
//addToFavoritesButton
var settings = {
  "url": "https://api.thecatapi.com/v1/favourites",
  "method": "POST",
  "data": "{\"image_id\":\"" + currentImageID + "\",\"sub_id\":\"" + userID + "\"}"
}
//getFavoritesButton
var settings = {
  "url": "https://api.thecatapi.com/v1/favourites?sub_id=" + userID,
  "method": "GET",

}
//faveCArd click
var settings = {
  "url": "https://api.thecatapi.com/v1/favourites/" + faveID,
  "method": "DELETE",
}
