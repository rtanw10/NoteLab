document.addEventListener('DOMContentLoaded', (event) => {
    const notes = window.localStorage.getItem("notes");
    if (notes === null) {
        return;
    }

    document.getElementById("notes").innerText = notes;
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

document.getElementById("bold").addEventListener("click", () => {
    let bold = document.getElementById("notes");
    if (bold.style.fontWeight === "bold") {
        bold.style.fontWeight = "";
    }
    else {
        bold.style.fontWeight = "bold";
    }
});

document.getElementById("italic").addEventListener("click", () => {
    let italics = document.getElementById("notes");
    if (italics.style.fontStyle === "italic") {
        italics.style.fontStyle = "";
    }
    else {
        italics.style.fontStyle = "italic";
    }
});

document.getElementById("alignLeft").addEventListener("click", () => {
    let left = document.getElementById("notes");
    if (left.style.textAlign === "left") {
        left.style.textAlign = "";
    }
    else {
        left.style.textAlign = "left";
    }
});

document.getElementById("alignCenter").addEventListener("click", () => {
    let center = document.getElementById("notes");
    if (center.style.textAlign === "center") {
        center.style.textAlign = "";
    }
    else {
        center.style.textAlign = "center";
    }
});

document.getElementById("alignRight").addEventListener("click", () => {
    let right = document.getElementById("notes");
    if (right.style.textAlign === "right") {
        right.style.textAlign = "";
    }
    else {
        right.style.textAlign = "right";
    }
});



