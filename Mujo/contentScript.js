
console.log("You are at " + window.location.href);

if (window.location.href.includes("netflix.com")) {
    waitForElementToDisplay(".PlayerControlsNeo__button-control-row", function() {

        var title = document.querySelector(".ellipsize-text h4")
        //console.log("You are currently watching " + title.innerText)
        alert("You are currently watching " + title.innerText)

    }, 500, 9000)
}
if (window.location.href.includes("crunchyroll.com")) {

    waitForElementToDisplay("h1 a span", function() {

        var title = document.querySelector("h1 a span")
        //console.log("You are currently watching " + title.innerText)
        alert("You are currently watching " + title.innerText)

    }, 500, 9000)
}
if (window.location.href.includes("hulu.com")) {

    waitForElementToDisplay(".PlayerMetadata__titleText .ClampedText span", function() {

        var title = document.querySelector(".PlayerMetadata__titleText .ClampedText span")
        //console.log("You are currently watching " + title.innerText)
        alert("You are currently watching " + title.innerText)
    }, 200, 9000)
}
if (window.location.href.includes("amazon.com")) {
    waitForElementToDisplay(".atvwebplayersdk-title-text", function() {

        var title = document.querySelector(".atvwebplayersdk-title-text")
        //console.log("You are currently watching " + title.innerText)
        alert("You are currently watching " + title.innerText)
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