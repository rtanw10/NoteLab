document.addEventListener('DOMContentLoaded', (event) => {
    let notes = window.localStorage.getItem("notes");
    if (notes !== null) {
        document.getElementById("notes").innerHTML = notes;
    }
    document.getElementById("saved").style.display = "initial";

    /*const darkMode = localStorage.getItem("isDarkMode");
    if (darkMode !== undefined && JSON.parse(darkMode)) {
        document.getElementById("darkMode").click()
    }*/

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "get text"}, addText)
    })
});

/*document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState === "hidden") {
        window.localStorage.setItem("isDarkMode", isDarkMode);
    }
});*/

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
//let isDarkMode = false;

function toggleSaveText(status) {
    switch (status) {
        case "saved":
            document.getElementById("saved").style.display = "initial";
            document.getElementById("saving").style.display = "none";
            document.getElementById("not-saved").style.display = "none";
            break;
        case "saving":
            document.getElementById("saved").style.display = "none";
            document.getElementById("saving").style.display = "initial";
            document.getElementById("not-saved").style.display = "none";
            break;
        case "not saved":
            document.getElementById("saved").style.display = "none";
            document.getElementById("saving").style.display = "none";
            document.getElementById("not-saved").style.display = "initial";
            break;
    }
}

function save() {
    toggleSaveText("saving");
    setTimeout(() => {
        window.localStorage.setItem("notes", notes.innerHTML);
        toggleSaveText("saved");
    }, 1500)
}
saveButton.addEventListener("click", save);

let content;
notes.addEventListener("input", (e) => {
    toggleSaveText("not saved");
    clearTimeout(content);
    content = setTimeout(save, 1000);
})

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

document.getElementById("undo").addEventListener("click", () => {
    changeFormat("undo");
});

document.getElementById("redo").addEventListener("click", () => {
    changeFormat("redo");
});

document.getElementById("backgroundColor").addEventListener("click", () => {
    document.getElementById("notes").style.backgroundColor = colorValue.value;
});

document.getElementById("fontfamily").addEventListener("click", () => {
    let fontFamily = prompt("What font family would you like your notes to be in?");
    if (fontFamily != null) {
        changeFormat("fontName", fontFamily);
    }
});

document.getElementById("fontSize").addEventListener("click", () => {
    let fontSize = prompt("What font size would you like for your notes? (Enter a number between 1 to 7)");
    if (fontSize != null) {
        changeFormat("fontSize", parseInt(fontSize));
    }
});

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

document.getElementById("lineDivider").addEventListener("click", () => {
    changeFormat("insertHorizontalRule");
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
    document.getElementById("notes").style.backgroundColor = "transparent";
});

//This is the code for dark mode
document.getElementById("darkMode").addEventListener("click", (event) => {
    document.body.classList.toggle("dark-mode");
    imageClockwiseRotation(event.target);
    //isDarkMode = !isDarkMode;
});

//This is the code to rotate the dark mode button
function imageClockwiseRotation(image) {
    image.style.transform += 'rotate(180deg)';
}

