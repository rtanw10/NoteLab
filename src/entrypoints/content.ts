import { onMessage } from "../utils/messaging";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    let addedContent = "";
    console.log("Started content script");

    onMessage("get", () => {
      const ret = addedContent;
      addedContent = "";
      console.log("Text sent and cleared.");
      return ret;
    });
    onMessage("store", (msg) => {
      addedContent += msg.data;
      console.log("Text saved.");
    });
  },
});
