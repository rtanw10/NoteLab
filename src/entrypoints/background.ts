import { sendMessage } from "../utils/messaging";

export default defineBackground(() => {
  console.log("add listener to browser.runtime");
  browser.runtime.onInstalled.addListener(async () => {
    browser.contextMenus.create({
      id: "notes_add",
      title: "Add Selection to Notes",
      type: "normal",
      contexts: ["selection", "audio", "image", "video"],
    });
  });

  console.log("add listener to browser.contextMenus");
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return;
    let textToAdd = "";
    switch (info.mediaType) {
      case "image":
        textToAdd = '<img src="' + info.srcUrl + '" alt="">';
        break;
      case "video":
        textToAdd =
          '<video controls width="250px"> <source src="' +
          info.srcUrl +
          '" contenteditable="true"> <a href="' +
          info.srcUrl +
          '">Video</a> </video>';
        break;
      case "audio":
        textToAdd =
          '<audio controls src="' +
          info.srcUrl +
          '" contenteditable="true"> <a href="' +
          info.srcUrl +
          '">Audio</a> </audio>';
        break;
      case undefined:
        textToAdd = info.selectionText || "";
        break;
    }

    if (textToAdd === "") return;

    sendMessage("store", textToAdd, tab.id);
  });
});
