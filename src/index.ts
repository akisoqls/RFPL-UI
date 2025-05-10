import "the-new-css-reset/css/reset.css";
import "./style.css";

type Command = string[];

let commandHistory: Command[] = [];
let h = commandHistory.length;

export const initCommandInput = (): void => {
  showHistory(commandHistory);
  const documentRoot = document.querySelector<HTMLElement>(":root");
  const commandDisplay = document.querySelector<HTMLDivElement>("div#command");
  const input = document.querySelector<HTMLInputElement>("input#command_input");
  const charTemplate = document.querySelector<HTMLTemplateElement>("template#command_char");
  if (!documentRoot || !input || !commandDisplay || !charTemplate) return;
  if (!("content" in charTemplate)) return;

  const setChar = () => {
    commandDisplay.querySelectorAll("*").forEach((e) => e.remove());

    Array.from(input.value + " ").forEach((char) => {
      const clone = charTemplate.content.cloneNode(true) as DocumentFragment;
      const charSpan = clone.querySelector("span");
      if (!charSpan) return;
      charSpan.innerText = char;
      commandDisplay.append(charSpan);
    });
  };

  const setCaret = () => {
    const selectStart = input.selectionStart;
    const selectEnd = input.selectionEnd;
    if (selectStart === null || selectEnd === null) return;
    const chars = Array.from(commandDisplay.querySelectorAll("span"));
    chars.forEach((e) => e.classList.remove("active"));
    const activeChars = chars.slice(selectStart, selectEnd + 1);
    activeChars.forEach((e) => e.classList.add("active"));
  };

  const setValue = (string: string = "") => {
    input.value = string;
    setChar();
    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length + 1;
    setCaret();
  };

  setValue();

  const getCommand = (): Command => {
    const { value } = input;
    if (value === "") return [""];
    setValue();
    return value.split(" ");
  };

  input.addEventListener("selectionchange", setCaret);
  input.addEventListener("focus", setCaret);
  input.addEventListener("input", setChar);
  input.addEventListener("blur", () => {
    const chars = Array.from(commandDisplay.querySelectorAll("span"));
    chars.forEach((e) => e.classList.remove("active"));
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      const command = getCommand();
      excCommand(command);
      h = commandHistory.length;
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !event.isComposing) {
      h =
        event.key === "ArrowUp"
          ? Math.max(h - 1, 0)
          : event.key === "ArrowDown"
            ? Math.min(h + 1, commandHistory.length)
            : h;
      setValue([...commandHistory, [""]][h].join(" "));
      event.preventDefault();
    }
  });

  commandDisplay.addEventListener("click", () => {
    input.focus();
    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length;
  });
};

const excCommand = (command: Command) => {
  commandHistory.push(command);
  if (command.join(" ") === "clear") commandHistory = [];
  showHistory(commandHistory);
};

const showHistory = (history: Command[]) => {
  const historyEl = document.querySelector<HTMLUListElement>("#history");
  const historyItem = document.querySelector<HTMLTemplateElement>("template#command_history_item");
  if (!historyEl || !historyItem || !("content" in historyItem)) return;
  historyEl.querySelectorAll("*").forEach((element) => element.remove());
  history.forEach((command) => {
    const clone = historyItem.content.cloneNode(true) as DocumentFragment;
    const li = clone.querySelector<HTMLLIElement>("li");
    const div = clone.querySelector<HTMLLIElement>("li > div.command");
    if (!li || !div) return;
    div.innerText = command.join(" ");
    historyEl.append(li);
  });
};
