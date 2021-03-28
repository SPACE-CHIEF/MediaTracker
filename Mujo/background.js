
self.importScripts("./firebase/firebase-app.js", "./firebase/firebase-auth.js", "./firebase/firebase-database.js")

var firebaseConfig = {
    apiKey: "AIzaSyDPbdTfxqjz-OWp-cXc6TmMw65YeBptGjM",
    authDomain: "moju-e6cff.firebaseapp.com",
    projectId: "moju-e6cff",
    storageBucket: "moju-e6cff.appspot.com",
    messagingSenderId: "508414131397",
    appId: "1:508414131397:web:eb506c5c63f6651c9b84ac",
    measurementId: "G-ZPRWN0YR81"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo);
    // Add if statements for all websites.
    if (changeInfo.url.includes("netflix.com/watch") ||
        changeInfo.url.includes("crunchyroll.com/") ||
        changeInfo.url.includes("hulu.com/watch") ||
        changeInfo.url.includes("amazon.com/")) {
        chrome.scripting.executeScript({
                target: {
                    tabId: tabId
                },
                files: ['contentScript.js'],
            },
            () => {});
    }
})

// This is the listener that waits for the contentScript to detect the movie/show and send that information back here so we can
// access Firebase and The Movie DB API. Outside API's are not accessible from contentScripts.
chrome.runtime.onMessage.addListener((message, sender, response) => {

    if (message.command == "contentScript") {
        console.log("MESSAGE RECIEVED FROM CONTENT SCRIPT");
        console.log("Show Title: " + message.title + "\nSeason Number: " + message.season + "\nEpisode Number: " + message.episode);
        response({
            "text": "Succesful operation brother."
        })
    }

    /*****************************AUTHENTICATION HANDLING*************************/
    if (message.command == "checkAuth") {
        var user = firebase.auth().currentUser
        if (user) {
            response({
                "type": "auth",
                "status": "success",
                "message": user
            })
        } else {
            response({
                "type": "auth",
                "status": "failure",
                "message": false
            })
        }
    }
    if (message.command == "loginUser") {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                response({"type": "auth", "status": "success", "message": user})

                return firebase.auth().signInWithEmailAndPassword(message.email, message.password);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }
    if(message.command == "logoutUser"){
        firebase.auth().signOut().then(() => {
            // Log-out successful
        }).catch((error) => {
            console.log(error)
        });
    }
    if(message.command == "createUser"){
        firebase.auth().createUserWithEmailAndPassword(message.userId, message.newPass)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                response({"type": "auth", "status": "success", "message": user})
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                response({"type": "auth", "status": "error", "message": errorMessage, "errorCode": errorCode})
            });
    }

    /*****************************ADDING TO DATABASE*************************/
    return true;
})