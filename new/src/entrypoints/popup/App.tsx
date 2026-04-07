import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "not saved"
  >("saved");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [color, setColor] = useState("#000000");
  const notesRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef(0);

  useEffect(() => {
    if (!notesRef.current) return;
    const savedNotes = window.localStorage.getItem("notes");
    if (savedNotes !== null) {
      notesRef.current.innerHTML = savedNotes;
    }

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tabs.forEach(async (tab) => {
        if (!notesRef.current) return;
        const text = await sendMessage("get", undefined, tab.id);
        if (!text) return;
        notesRef.current.innerHTML += "<br>" + text;
      });
    });
  }, []);

  const save = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      if (notesRef.current?.innerHTML) {
        window.localStorage.setItem("notes", notesRef.current?.innerHTML);
      }
      setSaveStatus("saved");
    }, 1500);
  };

  const onInput = () => {
    setSaveStatus("not saved");
    clearTimeout(saveTimeoutRef.current);
    // @ts-expect-error setTimeout returns a number in the browser
    saveTimeoutRef.current = setTimeout(save, 1000);
  };

  const handleSaveFile = () => {
    if (!notesRef.current) return;

    const preHtml =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const postHtml = "</body></html>";
    const html = preHtml + notesRef.current.innerHTML + postHtml;

    const url =
      "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

    const filename = prompt("What should be the name of the file?");
    if (!filename) return;

    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = filename + ".doc";
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const changeFormat = (format: string, extraValue?: string | number) => {
    document.execCommand(format, false, extraValue as string);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={"theme " + (isDarkMode ? "dark-mode" : "")}>
      <h1 className="title">
        NoteLab{" "}
        <img
          src="https://cdn-icons-png.flaticon.com/512/5558/5558282.png"
          alt="dark mode"
          style={{
            width: "27px",
            cursor: "pointer",
            transform: isDarkMode ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 1s ease-in-out",
          }}
          id="darkMode"
          title="Dark/Light Mode"
          onClick={toggleDarkMode}
        />
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <label style={{ fontSize: "17px", color: "#30A858" }}>
            Color Selector:{" "}
          </label>
          <input
            className="button"
            type="color"
            id="colorPicker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="buttonMenu">
          <button
            className="button"
            id="undo"
            title="Undo"
            onClick={() => changeFormat("undo")}
          >
            <span className="fa-solid fa-rotate-left"></span>
          </button>
          <button
            className="button"
            id="redo"
            title="Redo"
            onClick={() => changeFormat("redo")}
          >
            <span className="fa-solid fa-rotate-right"></span>
          </button>
          <button
            className="button"
            id="backgroundColor"
            title="Background Color"
            onClick={() => {
              if (notesRef.current)
                notesRef.current.style.backgroundColor = color;
            }}
          >
            <span className="fa-solid fa-paint-roller"></span>
          </button>
          <button
            className="button"
            id="fontfamily"
            title="Font Style"
            onClick={() => {
              const fontFamily = prompt(
                "What font family would you like your notes to be in?",
              );
              if (fontFamily != null) changeFormat("fontName", fontFamily);
            }}
          >
            Font Style
          </button>
          <button
            className="button"
            id="fontSize"
            title="Font Size"
            onClick={() => {
              const fontSize = prompt(
                "What font size would you like for your notes? (Enter a number between 1 to 7)",
              );
              if (fontSize != null)
                changeFormat("fontSize", parseInt(fontSize));
            }}
          >
            <span className="fa-solid fa-font"></span>{" "}
            <span className="fa-solid fa-plus"></span>
          </button>
          <button
            className="button"
            id="fontColor"
            title="Font Color"
            onClick={() => changeFormat("foreColor", color)}
          >
            <span className="fa fa-font"></span>{" "}
            <span className="fa fa-palette"></span>
          </button>
          <button
            className="button"
            id="bold"
            title="Bold"
            onClick={() => changeFormat("bold")}
          >
            <span className="fa fa-bold fa-fw"></span>
          </button>
          <button
            className="button"
            id="italic"
            title="Italic"
            onClick={() => changeFormat("italic")}
          >
            <span className="fa fa-italic fa-fw"></span>
          </button>
          <button
            className="button"
            id="underline"
            title="Underline"
            onClick={() => changeFormat("underline")}
          >
            <span className="fa fa-underline"></span>
          </button>
          <button
            className="button"
            id="strikeThrough"
            title="Strikethrough"
            onClick={() => changeFormat("strikeThrough")}
          >
            <span className="fa fa-strikethrough"></span>
          </button>
          <button
            className="button"
            id="highlight"
            title="Highlight"
            onClick={() => changeFormat("hiliteColor", color)}
          >
            <span className="fa fa-highlighter"></span>
          </button>
          <button
            className="button"
            id="indent"
            title="Indent"
            onClick={() => changeFormat("indent")}
          >
            <span className="fa-solid fa-indent"></span>
          </button>
          <button
            className="button"
            id="outdent"
            title="Outdent"
            onClick={() => changeFormat("outdent")}
          >
            <span className="fa-solid fa-outdent"></span>
          </button>
          <button
            className="button"
            id="alignLeft"
            title="Left Align"
            onClick={() => changeFormat("justifyLeft")}
          >
            <span className="fas fa-align-left"></span>
          </button>
          <button
            className="button"
            id="alignCenter"
            title="Center Align"
            onClick={() => changeFormat("justifyCenter")}
          >
            <span className="fas fa-align-center"></span>
          </button>
          <button
            className="button"
            id="alignRight"
            title="Right Align"
            onClick={() => changeFormat("justifyRight")}
          >
            <span className="fas fa-align-right"></span>
          </button>
          <button
            className="button"
            id="alignJustify"
            title="Justify Align"
            onClick={() => changeFormat("justifyFull")}
          >
            <span className="fa-solid fa-align-justify"></span>
          </button>
          <button
            className="button"
            id="list"
            title="Bullet Point List"
            onClick={() => changeFormat("insertunorderedlist")}
          >
            <span className="fa fa-list fa-fw"></span>
          </button>
          <button
            className="button"
            id="orderedList"
            title="Numbered List"
            onClick={() => changeFormat("insertorderedlist")}
          >
            <span className="fa fa-list-ol"></span>
          </button>
          <button
            className="button"
            id="hyperlink"
            title="Hyperlink"
            onClick={() => {
              const link = prompt("What url do you want the text to link to? ");
              if (link != null) {
                const selectedText = document.getSelection();
                changeFormat(
                  "insertHTML",
                  '<a href="' +
                    link +
                    '" target="_blank">' +
                    selectedText +
                    "</a>",
                );
              }
            }}
          >
            <span className="fa fa-link fa-fw"></span>
          </button>
          <button
            className="button"
            id="removeHyperlink"
            title="Remove HyperLink"
            onClick={() => changeFormat("unlink")}
          >
            <span className="fa fa-link-slash"></span>
          </button>
          <button
            className="button"
            id="lineDivider"
            title="Line Divider"
            onClick={() => changeFormat("insertHorizontalRule")}
          >
            <span className="fa-solid fa-arrows-left-right"></span>
          </button>
          <button
            className="button"
            id="subscript"
            title="Subscript"
            onClick={() => changeFormat("subscript")}
          >
            <span className="fa fa-subscript"></span>
          </button>
          <button
            className="button"
            id="superscript"
            title="Superscript"
            onClick={() => changeFormat("superscript")}
          >
            <span className="fa fa-superscript"></span>
          </button>
          <button
            className="button"
            id="clearFormat"
            title="Clear Formatting"
            onClick={() => changeFormat("removeFormat")}
          >
            <span className="fa fa-text-slash"></span>
          </button>
          <button
            className="button"
            id="clearNotes"
            title="Clear Notes"
            onClick={() => {
              notesRef.current?.innerHTML.replaceAll(/(.|\W)*/gi, "");
            }}
          >
            <span className="fa fa-trash"></span>
          </button>
        </div>
      </div>

      <br />

      <div
        contentEditable="true"
        className="notes"
        id="notes"
        ref={notesRef}
        onInput={onInput}
        suppressContentEditableWarning={true}
      />

      <br />

      <div style={{ display: "flex" }}>
        <button
          className="save"
          id="save"
          title="Save Note on NoteLab"
          onClick={save}
        >
          <span className="fa-regular fa-floppy-disk"></span> Save Notes
        </button>
        <button
          className="save"
          id="save_file"
          title="Download Note as Word Document"
          onClick={handleSaveFile}
        >
          <span className="fa-solid fa-download"></span> Save as Word Document
        </button>
        <div
          id="not-saved"
          style={{ display: saveStatus === "not saved" ? "initial" : "none" }}
        >
          Not Saved
        </div>
        <div
          id="saving"
          style={{ display: saveStatus === "saving" ? "initial" : "none" }}
        >
          Saving...
        </div>
        <div
          id="saved"
          style={{ display: saveStatus === "saved" ? "initial" : "none" }}
        >
          <span>Saved</span>
        </div>
      </div>
    </div>
  );
}

export default App;
