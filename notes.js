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


