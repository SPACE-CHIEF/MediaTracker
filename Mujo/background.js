chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo);
    // Add if statements for all websites.
    if (changeInfo.url.includes("netflix.com/watch") 
    ||  changeInfo.url.includes("crunchyroll.com/")
    ||  changeInfo.url.includes("hulu.com/watch")
    ||  changeInfo.url.includes("amazon.com/")) {
        chrome.scripting.executeScript(
            {
              target: {tabId: tabId},
              files: ['contentScript.js'],
            },
            () => {});
    }
})