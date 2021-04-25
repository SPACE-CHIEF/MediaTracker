var htmlBody = document.querySelector("body");

/*This is the only way we found to conduct unit testing in a chrome extension. Just sending all the different messages we have throuhgout the extension
  and making sure we get the correct response back. If the response is undefined for any message, then there was an issue with the message port closing or something else...  
*/

// -------------------- CONTENT SCRIPT MESSAGE TEST ----------------------
chrome.runtime.sendMessage({"type": "movie","title": "TEST - Movie", "command": "contentScript", "url": "www.google.com"}, (response) => {
    if(response !== undefined){
        htmlBody.innerHTML += `<p>${response.text}</p>`;
    }
    else {
        htmlBody.innerHTML += "<p>contentScript message failed</p>"
    }
})

chrome.runtime.sendMessage({"type": "tv","title": "Test TV Show", "season": 1, "episode": 1, "command": "contentScript", "url": "www.google.com"}, (response) => {
    if(response !== undefined){
        htmlBody.innerHTML += `<p>${response.text}</p>`
    }
    else{
        htmlBody.innerHTML += "<p>contentScript message failed</p>"
    }
})

// ------------------------- AUTHENTICATION MESSAGE TESTS ---------------------------
chrome.runtime.sendMessage({"command": "checkAuth"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>checkAuth message recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>checkAuth message failed</p>"
    }
})

chrome.runtime.sendMessage({"command": "loginUser"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>loginUser message recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>loginUser message failed</p>"
    }
})
chrome.runtime.sendMessage({"command": "logoutUser"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>logoutUser message recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>logoutUser message failed</p>"
    }
})
// -------------------------- FRONT-END MESSAGE TESTING -------------------------
chrome.runtime.sendMessage({"test": true,"command": "getAllCustomLists"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>getAllCustomLists message sent/recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>message failed</p>"
    }
})
chrome.runtime.sendMessage({"test": true,"command": "createCustomList"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>createCustomList message sent/recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>message failed</p>"
    }
})
chrome.runtime.sendMessage({"test": true,"command": "getMovies"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>getMovies message sent/recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>message failed</p>"
    }
})
chrome.runtime.sendMessage({"test": true,"command": "getTV"}, (response) => {
    if (response) {
        htmlBody.innerHTML += "<p>getTV message sent/recieved</p>"
    }
    else{
        htmlBody.innerHTML += "<p>message failed</p>"
    }
})