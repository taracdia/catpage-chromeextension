/* global chrome */
export default function askForPermission() {
    chrome.permissions.request({ permissions: ["identity.email"] }
        , (granted) => {
            // The callback argument will be true if the user granted the permissions
            if (granted) {
                chrome.identity.getProfileUserInfo(function (userInfo) {
                    var userID = JSON.stringify(userInfo["id"]);
                    userID = userID.replace(/"/g, "");
                    if (userID === "") {
                        alert("Sorry, you need to be signed in to save your favorites");
                        return false;
                    } else {
                        alert("You can save your favorites now");
                        localStorage.setItem("userID", userID);
                        return true;
                    }
                });
            } else {
                alert("You will not be able to save your favorites");
            }
            return false;
        });
}