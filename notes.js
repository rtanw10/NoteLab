document.addEventListener('DOMContentLoaded', (event) => {
    let notes = window.localStorage.getItem("notes");
    if (notes !== null) {
        document.getElementById("notes").innerHTML = notes;
    }

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "get text"}, addText)
    })
});

function addText(text) {
    if (text === undefined) {
        return;
    }
    console.log(text);
    console.log(typeof text);
    document.getElementById("notes").innerHTML += "<br>" + text;
};

const notes = document.getElementById("notes");
const saveButton = document.getElementById("save");
const saveFileButton = document.getElementById("save_file");
let colorValue = document.getElementById("colorPicker");

saveButton.addEventListener("click", (e) => {
    window.localStorage.setItem("notes", notes.innerHTML);
});

saveFileButton.addEventListener("click", (e) => {
    // if (notes.innerHTML.includes("img") || notes.innerHTML.includes("video") || notes.innerHTML.includes("audio")) {
    //     alert("Unfortunately, saving notes with images, videos, and audio files currently does not work. Sorry for the inconvenience.")
    //     return;
    // }
    //
    // const doc = jsPDF();
    // const filename = prompt("What should be the name of the file?")
    //
    // doc.fromHTML(notes.innerHTML, 15, 15, {
    //     width: "170"
    // });
    // doc.save(filename);

    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const postHtml = "</body></html>";
    const html = preHtml + notes.innerHTML + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    const filename = prompt("What should be the name of the file?") + '.doc'

    const downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
        downloadLink.href = url;

        downloadLink.download = filename;

        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
});

function changeFormat(format, extraValue) {
    document.execCommand(format, false, extraValue);
}

document.getElementById("fontColor").addEventListener("click", () => {
    changeFormat("foreColor", colorValue.value);
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
    changeFormat("hiliteColor", colorValue.value);
});

document.getElementById("indent").addEventListener("click", () => {
    changeFormat("indent");
});

document.getElementById("outdent").addEventListener("click", () => {
    changeFormat("outdent");
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

document.getElementById("alignJustify").addEventListener("click", () => {
    changeFormat("justifyFull");
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

//This is the code for dark mode
document.getElementById("darkMode").addEventListener("click", (event) => {
    document.body.classList.toggle("dark-mode");
    imageClockwiseRotation(event.target);
});

//This is the code to rotate the dark mode button
function imageClockwiseRotation(image) {
    image.style.transform += 'rotate(180deg)';
}

