checkAuth();

document.querySelector("#login-btn").addEventListener("click", () => {
    loginUser();
})

document.querySelector("#signup-btn").addEventListener("click", () => {
    createUser();
})

document.querySelector(".logout-btn").addEventListener("click", () => {
    logoutUser();
})

var port = chrome.runtime.connect(null, {name: 'hi'});

port.onDisconnect.addListener(obj => {
  console.log('disconnected port');
})

port.onMessage.addListener((msg) => {
    if (msg.command == "mediaFound") {
        console.log("mediaFound!!");
        document.querySelector("#mediaTitle").innerText = msg.title
        document.querySelector("#mediaInfo").innerText = msg.episodeInfo
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command == "stateChanged" && message.logged_in){
        document.querySelector('.main-container').style.display = 'grid';
        document.querySelector("#loginpage").style.display = "none";
        document.querySelector("#test-user-id").innerText = message.uid
        return true;
    }
    else if(message.command == "stateChanged" && !message.logged_in){
        document.querySelector("#loginpage").style.display = "block";
        return true;
    }
})

function checkAuth() {
    chrome.runtime.sendMessage({"command" : "checkAuth"}, (response) => {
        console.log(response);
        if (response.status == 'success') {
            document.querySelector('.main-container').style.display = 'grid';
            document.querySelector("#loginpage").style.display = "none";
            document.querySelector("#test-user-id").innerText = response.message.uid
        } else {
            document.querySelector("#loginpage").style.display = "block";
        }

        return true;
    })
}

function loginUser() {
    var email = document.querySelector("#emailID").value;
    var password = document.querySelector("#password").value;

    chrome.runtime.sendMessage({"command": "loginUser", "email": email, "password": password}, (response) => {
        console.log(response);
        if (response.status == 'success') {
            document.querySelector("#loginpage").style.display = "none";
            document.querySelector('.main-container').style.display = 'grid';
            
        } else {
            console.log("USER NOT AUTHENTICATED. from loginUser");
        }

    })
}

function createUser() {
    var newUserID = document.querySelector("#emailID").value;
    var newPassword = document.querySelector("#password").value;

    chrome.runtime.sendMessage({"command": "createUser", "userId": newUserID, "newPass": newPassword}, (response) => {
        console.log(response);
        if (response.status == "success") {
            document.querySelector("#loginpage").style.display = "none";
            document.querySelector('.main-container').style.display = 'grid';
            
        } else {
            console.log("USER NOT AUTHENTICATED. from createUser");
        }
    })
}

function logoutUser() {
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector("#loginpage").style.display = "block";

    chrome.runtime.sendMessage({"command": "logoutUser"}, (response) => {
        console.log(response);
    });
}