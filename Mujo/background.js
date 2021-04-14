
self.importScripts("./firebase/firebase-app.js", "./firebase/firebase-auth.js", "./firebase/firebase-database.js")

var firebaseConfig = {
    apiKey: "AIzaSyDPbdTfxqjz-OWp-cXc6TmMw65YeBptGjM",
    authDomain: "moju-e6cff.firebaseapp.com",
    databaseURL: "https://moju-e6cff-default-rtdb.firebaseio.com",
    projectId: "moju-e6cff",
    storageBucket: "moju-e6cff.appspot.com",
    messagingSenderId: "508414131397",
    appId: "1:508414131397:web:eb506c5c63f6651c9b84ac",
    measurementId: "G-ZPRWN0YR81"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// The Realtime Database object
var database = firebase.database();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    try {
        if (changeInfo.url != undefined || changeInfo.audible != undefined) {
            // Add if statements for all websites.
            if (changeInfo.audible ||
            changeInfo.url.includes("netflix.com/watch") ||
            changeInfo.url.includes("crunchyroll.com/") ||
            changeInfo.url.includes("hulu.com/watch") ||
            changeInfo.url.includes("amazon.com/")) {
            //console.log("The tab was updated to " + changeInfo.url + " and is it audible: " + changeInfo.audible)
            chrome.scripting.executeScript({
                    target: {
                        tabId: tabId
                    },
                    files: ['contentScript.js'],
                },() => {});
            }
        }
    } catch (error) {
        
    }
})

//Is constantly checking if the user's state changes; from logged in -> logged out or vice versa.
firebase.auth().onAuthStateChanged((user) => {
    //If the user is logged in, send a message to popup.js that we are logged in.
    if (user) {
        chrome.runtime.sendMessage({"command": "stateChanged", "logged_in": true, "user": user}, (response) => {})
    }

    return true;
})

var mediaObject = {"type": null,"title": null, "episodeInfo": null, "command": null, "image": "none"}

chrome.runtime.onConnect.addListener(port => {
    console.log('connected from bg ', port);

    if (port.name === 'port1') {
        port.postMessage(mediaObject);
    }
});

// This is the listener that waits for the contentScript to detect the movie/show and send that information back here so we can
// access Firebase and The Movie DB API. Outside API's are not accessible from contentScripts.
chrome.runtime.onMessage.addListener((message, sender, response) => {

    if (message.command == "getMovies") {
        var currentUser = firebase.auth().currentUser
        if (currentUser) {
            firebase.database().ref("users/" + currentUser.uid + "/master_lists/movies").once("value").then(function(snapshot) {
                response({"data": snapshot.val()})
            })
        }
    }
    if (message.command == "getTV") {
        var currentUser = firebase.auth().currentUser
        if (currentUser) {
            firebase.database().ref("users/" + currentUser.uid + "/master_lists/tv_shows").once("value").then(function(snapshot) {
                response({"data": snapshot.val()})
            })
        }
    }
    if (message.command == "contentScript") {
        var user = firebase.auth().currentUser
        var episodeInfo = "Season " + message.season + ", Episode " + message.episode
        var mediaTitle = message.title
        console.log("Media Title: " + mediaTitle);
        if (user) {
            const baseImagePath = "https://image.tmdb.org/t/p/original/"

            if(message.type == "tv"){
                var refLocations = firebase.database().ref("users/" + user.uid + "/master_lists/tv_shows/" + mediaTitle)
                refLocations.child(episodeInfo).set(message.url);
                
                var getTvPoster = fetch(`https://api.themoviedb.org/3/search/tv?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&page=1&query=${mediaTitle}&include_adult=false`)
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {

                        var imagePath = baseImagePath + data.results[0].poster_path
                        return imagePath
                    })

                getTvPoster.then(data => {
                    mediaObject.type = "tv"
                    mediaObject.title = mediaTitle
                    mediaObject.episodeInfo = episodeInfo
                    mediaObject.command = "mediaFound"
                    mediaObject.image = data
                })
            }
            else if (message.type == "movie") {
                var refLocations = firebase.database().ref("users/" + user.uid + "/master_lists/movies")
                refLocations.child(mediaTitle).set(message.url);

                var getMoviePoster = fetch(`https://api.themoviedb.org/3/search/movie?api_key=c9e5f6b44a8037f35894aef02579205a&language=en-US&query=${mediaTitle}&page=1`)
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {

                        var imagePath = baseImagePath + data.results[0].poster_path
                        return imagePath
                    })

                getMoviePoster.then(data => {
                    mediaObject.type = "movie"
                    mediaObject.title = mediaTitle
                    mediaObject.episodeInfo = null
                    mediaObject.command = "mediaFound"
                    mediaObject.image = data
                })
            }
            else if (message.type == "other") {
                mediaObject.type = "other"
                mediaObject.title = message.title
                mediaObject.episodeInfo = message.description
                mediaObject.command = "mediaFound"
            }
        }
        
        response({"text": "Succesful operation brother."})
    }

    /*****************************AUTHENTICATION HANDLING*************************/
    if (message.command == "checkAuth") {
        var user = firebase.auth().currentUser
        console.log("This is from the onMessage listener.");
        console.log(user);
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
        return true;
    }
    if (message.command == "loginUser") {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                
                var user = firebase.auth().currentUser;

                response({"type": "auth", "status": "success", "message": user})
                
                return firebase.auth().signInWithEmailAndPassword(message.email, message.password);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        
        return true;
    }
    if(message.command == "logoutUser"){
        firebase.auth().signOut().then(() => {
            // Log-out successful
        }).catch((error) => {
            console.log(error)
        });

        return true;
    }
    if(message.command == "createUser"){
        firebase.auth().createUserWithEmailAndPassword(message.userId, message.newPass)
            .then((userCredential) => {
                // Signed in 
                var userNew = userCredential.user;
                response({"type": "auth", "status": "success", "message": userNew})
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                response({"type": "auth", "status": "error", "message": errorMessage, "errorCode": errorCode})
            });

        return true;
    }

    /*****************************ADDING TO DATABASE*************************/
    return true;
})