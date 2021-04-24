var htmlBody = document.querySelector("body");

/*This is the only way we found to conduct unit testing in a chrome extension. Just sending all the different messages we have throuhgout the extension
  and making sure we get the correct response back. If the response is undefined for any message, then there was an issue with the message port closing or something else...  
*/
chrome.runtime.sendMessage({"command": "contentScript"}, (response) => {
    if(response !== undefined){
        htmlBody.innerHTML += response.text
    }
    else{
        htmlBody.innerHTML += "contentScript message failed"
    }
})