/*global chrome*/

chrome.runtime.onInstalled.addListener(function () {
        chrome.identity.getProfileUserInfo(function (userInfo) {
            var userID = JSON.stringify(userInfo["id"]);
            userID = userID.replace(/"/g, "");
            localStorage.setItem("userID", userID);
        });
        console.log(localStorage.getItem("userID"))
});