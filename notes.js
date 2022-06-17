document.addEventListener('DOMContentLoaded', (event) => {
    let notes = window.localStorage.getItem("notes");
    if (notes === null) {
        return;
    }

    function addText(text) {
        notes += "<br>" + text;
        console.log(notes);
        document.getElementById("notes").innerHTML = notes;
    }

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "get text"}, addText)
    })
});

const notes = document.getElementById("notes");
const saveButton = document.getElementById("save");
const saveFileButton = document.getElementById("save_file");

saveButton.addEventListener("click", (e) => {
    window.localStorage.setItem("notes", notes.innerText);
});

saveFileButton.addEventListener("click", (e) => {
    const element = document.createElement('a');
    const text = notes.innerHTML;
    const blob = new Blob([text], { type: 'plain/text' });
    const urlOfFile = URL.createObjectURL(blob);

    element.setAttribute('href', urlOfFile);
    element.setAttribute('download', "Notes"); //TODO make file a pdf somehow
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
});

function changeFormat(format, extraValue) {
    document.execCommand(format, false, extraValue);
}

document.getElementById("bold").addEventListener("click", () => {
    changeFormat("bold");
});

document.getElementById("italic").addEventListener("click", () => {
    changeFormat("italic");
});

document.getElementById("underline").addEventListener("click", () => {
    changeFormat("underline");
});

document.getElementById("strikeThrough").addEventListener("click", () => {
    changeFormat("strikeThrough");
});

document.getElementById("highlight").addEventListener("click", () => {
    changeFormat("hiliteColor", "yellow");
});

document.getElementById("alignLeft").addEventListener("click", () => {
    changeFormat("justifyLeft");
});

document.getElementById("alignCenter").addEventListener("click", () => {
    changeFormat("justifyCenter");
});

document.getElementById("alignRight").addEventListener("click", () => {
    changeFormat("justifyRight");
});

document.getElementById("list").addEventListener("click", () => {
    changeFormat("insertunorderedlist");
});

document.getElementById("orderedList").addEventListener("click", () => {
    changeFormat("insertorderedlist");
});

document.getElementById("subscript").addEventListener("click", () => {
    changeFormat("subscript");
});

document.getElementById("superscript").addEventListener("click", () => {
    changeFormat("superscript");
});

document.getElementById("clearFormat").addEventListener("click", () => {
    changeFormat("removeFormat");
});

document.getElementById("clearNotes").addEventListener("click", (e) => {
    notes.innerHTML = "";
});


