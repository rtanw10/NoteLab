import { useState, useEffect, useRef } from "react";
import "./App.css";
import { sendMessage } from "../../utils/messaging";

type NotesMode = "website" | "global";

const NOTES_MODE_STORAGE_KEY = "notes_mode";

function App() {
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "not saved"
  >("saved");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [color, setColor] = useState("#000000");
  const [notesMode, setNotesMode] = useState<NotesMode>("website");
  const [currentDomain, setCurrentDomain] = useState<string>("global");
  const notesRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef(0);

  const getDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "global";
    }
  };

  const getStorageKey = (domain: string, mode: NotesMode) => {
    if (mode === "global") return "notes_global";
    return `notes_${domain}`;
  };

  const loadNotesForMode = (mode: NotesMode) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const domain = tab?.url ? getDomainFromUrl(tab.url) : "global";
      setCurrentDomain(domain);

      if (!notesRef.current) return;

      const savedNotes = window.localStorage.getItem(
        getStorageKey(domain, mode),
      );
      if (savedNotes !== null) {
        notesRef.current.innerHTML = savedNotes;
      } else {
        notesRef.current.innerHTML = "";
      }

      tabs.forEach(async (tabItem) => {
        if (!notesRef.current || !tabItem.id) return;
        const text = await sendMessage("get", undefined, tabItem.id);
        if (!text) return;
        notesRef.current.innerHTML += "<br>" + text;
      });
    });
  };

  useEffect(() => {
    const persistedMode = window.localStorage.getItem(NOTES_MODE_STORAGE_KEY);
    const initialMode: NotesMode =
      persistedMode === "global" ? "global" : "website";
    setNotesMode(initialMode);
    loadNotesForMode(initialMode);
  }, []);

  const save = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      if (notesRef.current?.innerHTML) {
        window.localStorage.setItem(
          getStorageKey(currentDomain, notesMode),
          notesRef.current?.innerHTML,
        );
      }
      setSaveStatus("saved");
    }, 1500);
  };

  const toggleNotesMode = () => {
    clearTimeout(saveTimeoutRef.current);
    if (notesRef.current?.innerHTML) {
      window.localStorage.setItem(
        getStorageKey(currentDomain, notesMode),
        notesRef.current.innerHTML,
      );
    }

    const nextMode: NotesMode = notesMode === "global" ? "website" : "global";
    setNotesMode(nextMode);
    window.localStorage.setItem(NOTES_MODE_STORAGE_KEY, nextMode);
    setSaveStatus("saved");
    loadNotesForMode(nextMode);
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
      <div className="header">
        <div className="header-left">
          <h1 className="title">NoteLab</h1>
        </div>
        <div className="header-right">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5558/5558282.png"
            alt="Toggle dark/light mode"
            id="darkMode"
            title="Toggle Dark/Light Mode"
            onClick={toggleDarkMode}
            style={{
              transform: isDarkMode ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      <div className="domain-indicator">
        <div className="domain-display">
          <span className="fa fa-globe"></span>
          <span className="domain-text">
            {notesMode === "global" ? "Global Notes" : currentDomain}
          </span>
        </div>
        <button
          className={"mode-toggle " + (notesMode === "global" ? "active" : "")}
          type="button"
          onClick={toggleNotesMode}
          title="Toggle between global and website-based notes"
        >
          Global: {notesMode === "global" ? "On" : "Off"}
        </button>
      </div>

      <div className="toolbar-container">
        <div className="toolbar-section">
          <div className="buttonMenu">
            <div className="button-group">
              <button
                className="button"
                title="Undo"
                onClick={() => changeFormat("undo")}
              >
                <span className="fa-solid fa-rotate-left"></span>
              </button>
              <button
                className="button"
                title="Redo"
                onClick={() => changeFormat("redo")}
              >
                <span className="fa-solid fa-rotate-right"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Bold"
                onClick={() => changeFormat("bold")}
              >
                <span className="fa fa-bold fa-fw"></span>
              </button>
              <button
                className="button"
                title="Italic"
                onClick={() => changeFormat("italic")}
              >
                <span className="fa fa-italic fa-fw"></span>
              </button>
              <button
                className="button"
                title="Underline"
                onClick={() => changeFormat("underline")}
              >
                <span className="fa fa-underline"></span>
              </button>
              <button
                className="button"
                title="Strikethrough"
                onClick={() => changeFormat("strikeThrough")}
              >
                <span className="fa fa-strikethrough"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Font Color"
                onClick={() => changeFormat("foreColor", color)}
              >
                <span className="fa fa-font"></span>{" "}
                <span className="fa fa-palette"></span>
              </button>
              <button
                className="button"
                title="Highlight"
                onClick={() => changeFormat("hiliteColor", color)}
              >
                <span className="fa fa-highlighter"></span>
              </button>
              <button
                className="button"
                title="Background Color"
                onClick={() => {
                  if (notesRef.current)
                    notesRef.current.style.backgroundColor = color;
                }}
              >
                <span className="fa-solid fa-paint-roller"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
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
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Left Align"
                onClick={() => changeFormat("justifyLeft")}
              >
                <span className="fas fa-align-left"></span>
              </button>
              <button
                className="button"
                title="Center Align"
                onClick={() => changeFormat("justifyCenter")}
              >
                <span className="fas fa-align-center"></span>
              </button>
              <button
                className="button"
                title="Right Align"
                onClick={() => changeFormat("justifyRight")}
              >
                <span className="fas fa-align-right"></span>
              </button>
              <button
                className="button"
                title="Justify Align"
                onClick={() => changeFormat("justifyFull")}
              >
                <span className="fa-solid fa-align-justify"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Indent"
                onClick={() => changeFormat("indent")}
              >
                <span className="fa-solid fa-indent"></span>
              </button>
              <button
                className="button"
                title="Outdent"
                onClick={() => changeFormat("outdent")}
              >
                <span className="fa-solid fa-outdent"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Bullet Point List"
                onClick={() => changeFormat("insertunorderedlist")}
              >
                <span className="fa fa-list fa-fw"></span>
              </button>
              <button
                className="button"
                title="Numbered List"
                onClick={() => changeFormat("insertorderedlist")}
              >
                <span className="fa fa-list-ol"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Hyperlink"
                onClick={() => {
                  const link = prompt(
                    "What url do you want the text to link to? ",
                  );
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
                title="Remove HyperLink"
                onClick={() => changeFormat("unlink")}
              >
                <span className="fa fa-link-slash"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Subscript"
                onClick={() => changeFormat("subscript")}
              >
                <span className="fa fa-subscript"></span>
              </button>
              <button
                className="button"
                title="Superscript"
                onClick={() => changeFormat("superscript")}
              >
                <span className="fa fa-superscript"></span>
              </button>
            </div>

            <div className="button-group">
              <button
                className="button"
                title="Line Divider"
                onClick={() => changeFormat("insertHorizontalRule")}
              >
                <span className="fa-solid fa-arrows-left-right"></span>
              </button>
              <button
                className="button"
                title="Clear Formatting"
                onClick={() => changeFormat("removeFormat")}
              >
                <span className="fa fa-text-slash"></span>
              </button>
              <button
                className="button"
                title="Clear Notes"
                onClick={() => {
                  notesRef.current?.innerHTML.replaceAll(/(.|\W)*/gi, "");
                }}
              >
                <span className="fa fa-trash"></span>
              </button>
            </div>
            <div className="toolbar-color-picker">
              <label htmlFor="colorPicker" className="color-picker-label">
                Color:
              </label>
              <input
                type="color"
                id="colorPicker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Select color for text and highlights"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        contentEditable="true"
        className="notes"
        id="notes"
        ref={notesRef}
        onInput={onInput}
        suppressContentEditableWarning={true}
      />

      <div className="action-bar">
        <button
          className="save"
          id="save"
          title="Save Note on NoteLab"
          onClick={save}
        >
          <span className="fa-regular fa-floppy-disk"></span>
          <span>Save Notes</span>
        </button>
        <button
          className="save"
          id="save_file"
          title="Download Note as Word Document"
          onClick={handleSaveFile}
        >
          <span className="fa-solid fa-download"></span>
          <span>Save as Word Document</span>
        </button>
        {saveStatus === "not saved" && (
          <div id="not-saved" className="status-indicator">
            <span className="fa fa-circle"></span>
            <span>Not Saved</span>
          </div>
        )}
        {saveStatus === "saving" && (
          <div id="saving" className="status-indicator">
            <span className="fa fa-spinner fa-spin"></span>
            <span>Saving...</span>
          </div>
        )}
        {saveStatus === "saved" && (
          <div id="saved" className="status-indicator">
            <span className="fa fa-check-circle"></span>
            <span>Saved</span>
          </div>
        )}
      </div>

      <div className="footer">
        <a
          href="mailto:notelab2022@gmail.com?subject=Bug Report&body=Please describe the bug you encountered:"
          title="Report a bug"
        >
          <span className="fa fa-bug"></span>
          <span>Report Bug</span>
        </a>
        <a
          href="mailto:notelab2022@gmail.com?subject=Feature Request&body=Please describe the feature you'd like to see:"
          title="Request a feature"
        >
          <span className="fa fa-lightbulb"></span>
          <span>Request Feature</span>
        </a>
      </div>
    </div>
  );
}

export default App;
