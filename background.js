chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "notes_add",
        title: "Add Selection to Notes",
        type: "normal",
        contexts: ["selection", "audio", "image", "video"]
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    let textToAdd = "";
    switch (info.mediaType) {
        case "image":
            textToAdd = '<img src="' + info.srcUrl + '" alt="">';
            break;
        case "video":
            textToAdd = '<video controls width="250px"> <source src="' + info.srcUrl + '" contenteditable="true"> Sorry, this version of chrome does not support embedded videos. </video>';
            break;
        case "audio":
            textToAdd = '<audio controls src="' + info.srcUrl + '" contenteditable="true"> Sorry, this version of chrome does not supprt embedded audio. </audio>';
            break;
        case undefined:
            textToAdd = info.selectionText;
            break;
    }

    chrome.tabs.sendMessage(tab.id, {text: textToAdd, type: "store text"}, (response) => {});
})
