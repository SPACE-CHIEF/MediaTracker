
chrome.runtime.sendMessage({"command" : "checkAuth"}, (response) => {
    console.log(response);
    if (response.status == 'success') {
        document.querySelector('.main-container').style.display = 'grid';
        document.querySelector("#loginpage").style.display = "none";
        document.querySelector("#test-user-id").innerText = response.message.uid
    } else {
        document.querySelector("#loginpage").style.display = "block";
    }
})

document.querySelector("#login-btn").addEventListener("click", () => {
    loginUser();
})

document.querySelector("#signup-btn").addEventListener("click", () => {
    createUser();
})

document.querySelector(".logout-btn").addEventListener("click", () => {
    logoutUser();
})

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