
console.log("You are at " + window.location.href);

var title = "";
var episodeData = "";
var seasonNum = "1";
var episodeNum = "1";
var episodeName = "No name given";

if (window.location.href.includes("netflix.com")) {
    waitForElementToDisplay(".PlayerControlsNeo__button-control-row", function() {

        title = document.querySelector(".ellipsize-text h4")
        episodeData = document.querySelectorAll(".ellipsize-text span")[0].innerText
        seasonNum = episodeData.charAt(1)
        episodeNum = episodeData.substring(episodeData.indexOf("E")+1)

        episodeName = episodeData[1].innerHTML

        alert("You are currently watching " + title.innerText + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)
        
        chrome.runtime.sendMessage({"title": title.innerText, "season": seasonNum, "episode": episodeNum, "command": "contentScript"}, (response) => {
            console.log("RESPONSE RECIEVED: " + response.text);
        })
        
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
else if (window.location.href.includes("hulu.com")) {

    waitForElementToDisplay(".PlayerMetadata__titleText .ClampedText span", function() {

        title = document.querySelector(".PlayerMetadata__titleText .ClampedText span")
        episodeData = document.querySelector(".PlayerMetadata__seasonEpisodeText").innerText
        seasonNum = episodeData.match(/\d+/)[0]
        episodeNum = episodeData.substring(episodeData.indexOf(seasonNum) + 1).match(/\d+/)[0]

        episodeName = document.querySelector(".PlayerMetadata__subTitleText").innerText

        alert("You are currently watching " + title.innerText + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum + "\nName: " + episodeName)
    }, 200, 9000)
}
else if (window.location.href.includes("amazon.com")) {
    waitForElementToDisplay("div#dv-web-player.dv-player-fullscreen", function() {

        waitForElementToDisplay(".atvwebplayersdk-subtitle-text", function() {
            title = document.querySelector(".atvwebplayersdk-title-text")
            episodeData = document.querySelector(".atvwebplayersdk-subtitle-text").innerText
            seasonNum = episodeData.match(/\d+/)[0]
            episodeNum = episodeData.substring(episodeData.indexOf(seasonNum) + 1).match(/\d+/)[0]

            alert("You are currently watching " + title.innerText + "\nSeason: " + seasonNum + "\nEpisode: " + episodeNum)
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