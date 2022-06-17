let addedContent = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "store text") {
        addedContent += message.text;
        console.log("Text saved.")
    }
    else if (message.type === "get text") {
        sendResponse(addedContent);
        addedContent = "";
        console.log("Text sent and cleared.")
    }
});
