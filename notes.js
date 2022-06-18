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
    window.localStorage.setItem("notes", notes.innerHTML);
});

saveFileButton.addEventListener("click", (e) => {
    const element = document.createElement('a');
    const text = notes.innerHTML;
    const blob = new Blob([text], { type: 'plain/text' });
    const urlOfFile = URL.createObjectURL(blob);
    let filename = prompt("What should be the name of the file? ");

    element.setAttribute('href', urlOfFile);
    element.setAttribute('download', filename); //TODO make file a pdf somehow
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
});

function changeFormat(format, extraValue) {
    document.execCommand(format, false, extraValue);
}

document.getElementById("fontColor").addEventListener("click", () => {
    let color = prompt("What color would you like the text to be? (Write the hexadecimal value for the color)");
    if (color != null) {
        changeFormat("foreColor", color);
    }
});

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
    let color = prompt("What color would you like to highlight with? (Write the hexadecimal value for the color)");
    if (color != null) {
        changeFormat("hiliteColor", color);
    }
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

document.getElementById("hyperlink").addEventListener("click", () => {
    let link = prompt("What url do you want the text to link to? ");
    if (link != null) {
        var selectedText = document.getSelection();
        changeFormat("insertHTML", '<a href="' + link + '" target="_blank">' + selectedText + '</a>');
    }
});

document.getElementById("removeHyperlink").addEventListener("click", () => {
    changeFormat("unlink");
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


