import "the-new-css-reset/css/reset.css";
import "./style.css";
import type { Command, CommandResult } from "./Command";
import { default as commandIndex } from "./commands/index";

type CalledCommand = {
  command: string[];
  result?: CommandResult;
};

let callHistory: CalledCommand[] = [];
let h = callHistory.length;

export const initCommandInput = (): void => {
  callHistory.forEach((history) => {
    appendHistory(history);
  });
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

  const getCommand = (): CalledCommand => {
    const { value } = input;
    if (value === "")
      return {
        command: [""],
      };
    setValue();
    return {
      command: value.split(" "),
    };
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
      h = callHistory.length;
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !event.isComposing) {
      h =
        event.key === "ArrowUp"
          ? Math.max(h - 1, 0)
          : event.key === "ArrowDown"
            ? Math.min(h + 1, callHistory.length)
            : h;
      setValue([...callHistory, { command: [""] }][h].command.join(" "));
      event.preventDefault();
    }
  });

  const onTouchMove = () => input.blur();
  input.addEventListener("focus", () => {
    document.addEventListener("touchmove", onTouchMove);
  });
  input.addEventListener("blur", () => {
    document.removeEventListener("touchmove", onTouchMove);
  });

  commandDisplay.addEventListener("click", () => {
    input.focus();
    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length;
  });
};

const excCommand = async (command: CalledCommand) => {
  if (command.command.join(" ") === "clear") {
    callHistory = [];
    clearHistory();
    return;
  }
  const result = await parseCommand(command);
  callHistory.push({
    ...command,
    result,
  });
  appendHistory({
    ...command,
    result,
  });
};

const parseCommand = async (command: CalledCommand): Promise<CommandResult> => {
  const [commandName, ...args] = command.command;
  if (commandName === "") {
    return {
      contentType: "text/text",
      body: ``,
    };
  }
  try {
    const Command = commandIndex[commandName];
    if (Command === undefined) throw new Error("command not found");
    const c = new Command() as Command;
    return (await c.exec(args)).result;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Command is not a constructor" ||
        error.message === "command not found"
      ) {
        return {
          contentType: "text/text",
          body: `command not found: ${commandName}`,
        };
      }
      return {
        contentType: "text/text",
        body: `unknown error: ${commandName} \n ${error.message}`,
      };
    } else {
      return {
        contentType: "text/text",
        body: `unknown error: ${commandName}`,
      };
    }
  }
};

const appendHistory = (command: CalledCommand) => {
  const historyEl = document.querySelector<HTMLUListElement>("#history");
  const historyItem = document.querySelector<HTMLTemplateElement>("template#command_history_item");
  if (!historyEl || !historyItem || !("content" in historyItem)) return;
  const clone = historyItem.content.cloneNode(true) as DocumentFragment;
  const li = clone.querySelector<HTMLLIElement>("li");
  const commandElement = clone.querySelector<HTMLLIElement>("li > div.command_wrap > div.command");
  const resultElement = clone.querySelector<HTMLLIElement>("li > div.result");
  if (!li || !commandElement || !resultElement) return;
  commandElement.innerText = command.command.join(" ");
  if (command.result) {
    if (command.result.contentType === "text/html") {
      const shadowRoot = resultElement.attachShadow({ mode: "open" });
      insertResultHtml(shadowRoot, command.result);
    } else {
      resultElement.innerText = command.result ? command.result.body.toString() : "";
    }
  }
  historyEl.append(li);
};

const clearHistory = () => {
  const historyEl = document.querySelector<HTMLUListElement>("#history");
  if (!historyEl) return;
  historyEl.querySelectorAll("*").forEach((e) => e.remove());
};

const insertResultHtml = (element: ShadowRoot, commandResult: CommandResult): ShadowRoot => {
  if (!commandResult || commandResult.contentType !== "text/html") return element;
  const resultHtml = commandResult.body;
  const content = resultHtml.cloneNode(true) as DocumentFragment;
  const scripts = Array.from(content.querySelectorAll<HTMLScriptElement>("script"));
  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
      const wrapped = `(function(document){${newScript.textContent}})(document);`;
      new Function("document", wrapped)(element);
    }
  });
  element.appendChild(content);
  return element;
};
