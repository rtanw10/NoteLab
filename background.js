chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "notes_add",
        title: "Add Selection to Notes",
        type: "normal",
        contexts: ["selection", "audio", "image", "video"]
    })
})

chrome.contextMenus.onClicked.addListener((info) => {
    switch (info.mediaType) {
        case undefined: //TODO Add image, video, and audio cases
            chrome.runtime.sendMessage({add: info.selectionText}, (response) => {});
    }
})
