// /*global chrome*/

//todo: implement optional permissions
chrome.runtime.onInstalled.addListener(function () {
    chrome.identity.getProfileUserInfo(function (userInfo) {
        var userID = JSON.stringify(userInfo["id"]);
        userID = userID.replace(/"/g, "");
        if (userID !== "") {
            localStorage.setItem("userID", userID);
        }
    });
});

// // function askForIdentityPermission() {
// //     chrome.permissions.request({
// //         permissions: ["identity"]
// //     }, function (granted) {
// //         // The callback argument will be true if the user granted the permissions.
// //         if (granted) {
// //             chrome.identity.getProfileUserInfo(function (userInfo) {
// //                 var userID = JSON.stringify(userInfo["id"]);
// //                 userID = userID.replace(/"/g, "");
// //                 if (userID === "") {
// //                     alert("Sorry, you need to be signed in to save your favorites")
// //                 } else {
// //                     alert("You can save your favorites now");
// //                     localStorage.setItem("userID", userID);
// //                 }
// //             });
// //         } else {
// //             alert("You will not be able to save your favorites");
// //         }
// //     });
// // }

// function askForStoragePermission() {
//     console.log("ask")
//     chrome.permissions.request({
//         permissions: ["storage"]
//     }, function (granted) {
//         if (granted) {
//             alert("You will now be able to save your settings");
//         } else {
//             alert("You will not be able to save your settings");
//         }
//     });
// }

// // function tryToStore(name, value) {
// //     chrome.permissions.contains({
// //         permissions: ["storage"]
// //     }, function (result) {
// //         if (result) {
// //             localStorage.setItem(name, value);
// //         }
// //     });
// // }

// function addEventListener() {
//     console.log("addEventListener")
// document.querySelector('#askForStoragePermission').addEventListener('click', function(event) {
//     console.log("event")
//     askForStoragePermission();

//   });
// }

// // chrome.runtime.onStartup.addListener(addEventListener())
// setTimeout(addEventListener, 5000); 