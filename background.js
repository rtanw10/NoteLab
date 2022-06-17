chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "notes_add",
        title: "Add Selection to Notes",
        type: "normal",
        contexts: ["selection"]
    })
})