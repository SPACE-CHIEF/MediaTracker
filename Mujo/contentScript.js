
console.log("You are at " + window.location.href);

var title = "";
var episodeData = "";
var seasonNum = "1";
var episodeNum = "1";
var episodeName = "No name given";

if (window.location.href.includes("netflix.com")) {
    waitForElementToDisplay(".PlayerControlsNeo__button-control-row", function() {

        title = document.querySelector(".video-title h4").innerHTML
        var arrayOfSpans = document.querySelectorAll(".video-title span")

        //This if statement checks to see if it is a TV show or a movie. If it is a TV Show, then arrayOfSpans should have length 2. If its a movie, length will be 0.
        if (arrayOfSpans.length > 0) {
            episodeData = arrayOfSpans[0].innerText
            seasonNum = episodeData.charAt(1)
            episodeNum = episodeData.substring(episodeData.indexOf("E")+1)

            episodeName = episodeData[1].innerHTML

            alert("You are currently watching a TV SHOW!" + title + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)
            
            chrome.runtime.sendMessage({"type": "tv","title": title, "season": seasonNum, "episode": episodeNum, "command": "contentScript"}, (response) => {
                console.log("RESPONSE RECIEVED: " + response.text);
            })
        }
        else{
            alert("You are currently watching a MOVIE!" + "\nMovie title: " + title)
            chrome.runtime.sendMessage({"type": "movie","title": title, "command": "contentScript"}, (response) => {
                console.log("RESPONSE RECIEVED: " + response.text);
            })
        }
        
    }, 500, 9000)
}
else if (window.location.href.includes("crunchyroll.com")) {

    waitForElementToDisplay("h1 a span", function() {

        title = document.querySelector("h1 a span")
        episodeData = document.querySelectorAll("#showmedia_about_media h4")[1].innerText

        //There are some shows that don't have any seasons, such as Hunter x Hunter
        if (episodeData.includes("Season")) {
            seasonNum = episodeData.match(/\d+/)[0]
            episodeNum = episodeData.substring(episodeData.indexOf(seasonNum) + 1).match(/\d+/)[0]
        }
        else{
            episodeNum = episodeData.match(/\d+/)[0]
        }
        
        episodeName = document.querySelector("#showmedia_about_info h4").innerText

        alert("You are currently watching " + title.innerText + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)

    }, 500, 9000)
}
else if (window.location.href.includes("hulu.com/watch")) {

    //Alternative: PlayerMetadata PlayerMetadata--collapsed OnNowMetadata
    // .PlayerMetadata__titleText .ClampedText span
    // .PlayerMetadata.PlayerMetadata--collapsed.OnNowMetadata
    console.log("HULU");
    waitForElementToDisplay(".PlayerMetadata__titleText .ClampedText span", function() {
        
        title = document.querySelector(".PlayerMetadata__titleText .ClampedText span").innerText
        
        setTimeout(() => {
            var arrayForDetection = document.querySelectorAll(".PlayerMetadata__subTitle .PlayerMetadata__seasonEpisodeText")
            console.log("LENGTH OF ARRAY: " + arrayForDetection.length);
            if (arrayForDetection.length == 4) {
                episodeData = arrayForDetection[0].innerText
                seasonNum = episodeData.match(/\d+/)[0]
                episodeNum = episodeData.substring(episodeData.indexOf(seasonNum) + 1).match(/\d+/)[0]

                episodeName = document.querySelector(".PlayerMetadata__subTitleText").innerText

                alert("You are currently watching a TV Show!\nTitle: " + title + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)
                
                chrome.runtime.sendMessage({"type": "tv","title": title, "season": seasonNum, "episode": episodeNum, "command": "contentScript"}, (response) => {
                    console.log("RESPONSE RECIEVED: " + response.text);
                })
            }
            else if (arrayForDetection.length < 4){
                alert("You are currently watching a MOVIE!" + "\nMovie title: " + title)
                chrome.runtime.sendMessage({"type": "movie","title": title, "command": "contentScript"}, (response) => {
                    console.log("RESPONSE RECIEVED: " + response.text);
                })
            }
        }, 5000);
        
    }, 200, 9000)
}
else if (window.location.href.includes("amazon.com")) {
    console.log("AMAZON");
    waitForElementToDisplay("div#dv-web-player.dv-player-fullscreen", function() {
        
        title = document.querySelector(".atvwebplayersdk-title-text")
        
        amazonWaitForElement(".atvwebplayersdk-subtitle-text", function() {

            setTimeout(() => {
                episodeData = document.querySelector(".atvwebplayersdk-subtitle-text").innerText
                //If episodeData is null, you are watching a Movie!
                if (episodeData.length == 0) {
                    alert("You are currently watching a MOVIE!" + "\nMovie title: " + title.innerText)
                    chrome.runtime.sendMessage({"type": "movie","title": title.innerText, "command": "contentScript"}, (response) => {
                        console.log("RESPONSE RECIEVED: " + response.text);
                    })
                }
                else{
                    seasonNum = episodeData.match(/\d+/)[0]
                    episodeNum = episodeData.substring(episodeData.indexOf(seasonNum) + 1).match(/\d+/)[0]
                
                    alert("You are currently watching a TV Show!\nTitle: " + title.innerText + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)
                        
                    chrome.runtime.sendMessage({"type": "tv","title": title.innerText, "season": seasonNum, "episode": episodeNum, "command": "contentScript"}, (response) => {
                        console.log("RESPONSE RECIEVED: " + response.text);
                    })
                }    
            }, 2000);

        }, 500, 9000)
        
    }, 500, 9000)
      
}

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null && document.querySelector(selector).innerText.length != 0) {
            callback();
            return;
        } else {
            setTimeout(function() {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}

function amazonWaitForElement(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            callback();
            return;
        } else {
            setTimeout(function() {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}