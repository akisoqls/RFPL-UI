import "./terminal.css";
import type { Command, CommandResult } from "../Command";
import html from "./terminal.html?raw";
import { default as commandIndex } from "../commands/index";

type CalledCommand = {
  command: string[];
  result?: CommandResult;
};

export class Terminal {
  public terminal: string = html;

  private commands = commandIndex;

  private terminalDoc: Document;
  private commandDisplay: HTMLDivElement;
  private input: HTMLInputElement;
  private charTemplate: HTMLTemplateElement;
  private callHistory: CalledCommand[] = [];
  private h = this.callHistory.length;
  private root: HTMLElement | Document | undefined;
  private document = document;

  constructor() {
    const DP = new DOMParser();
    this.terminalDoc = DP.parseFromString(html, "text/html");

    const commandDisplay = this.terminalDoc.querySelector<HTMLDivElement>("div#command");
    const input = this.terminalDoc.querySelector<HTMLInputElement>("input#command_input");
    const charTemplate =
      this.terminalDoc.querySelector<HTMLTemplateElement>("template#command_char");
    if (!input || !commandDisplay || !charTemplate || !("content" in charTemplate)) {
      throw new Error("");
    }
    this.commandDisplay = commandDisplay;
    this.input = input;
    this.charTemplate = charTemplate;

    this.setValue();

    this.input.addEventListener("selectionchange", () => {
      this.setCaret(this.input.selectionStart, this.input.selectionEnd);
    });
    this.input.addEventListener("focus", () => {
      this.setCaret(this.input.selectionStart, this.input.selectionEnd);
    });
    this.input.addEventListener("input", this.setChar);
    this.input.addEventListener("blur", () => {
      const chars = Array.from(commandDisplay.querySelectorAll("span"));
      chars.forEach((e) => e.classList.remove("active"));
    });
    this.input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        const command = this.getCommand();
        await this.excCommand(command);
        this.h = this.callHistory.length;
      }
      if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !event.isComposing) {
        this.h =
          event.key === "ArrowUp"
            ? Math.max(this.h - 1, 0)
            : event.key === "ArrowDown"
              ? Math.min(this.h + 1, this.callHistory.length)
              : this.h;

        this.setValue([...this.callHistory, { command: [""] }][this.h].command.join(" "));
        event.preventDefault();
      }
    });

    const onTouchMove = () => this.input.blur();
    this.input.addEventListener("focus", () => {
      this.terminalDoc.addEventListener("touchmove", onTouchMove);
    });
    this.input.addEventListener("blur", () => {
      this.terminalDoc.removeEventListener("touchmove", onTouchMove);
    });

    commandDisplay.addEventListener("click", () => {
      this.input.focus();
      this.input.selectionStart = this.input.value.length;
      this.input.selectionEnd = this.input.value.length;
    });
    return this;
  }

  private setChar = () => {
    this.commandDisplay.querySelectorAll("*").forEach((e) => e.remove());

    Array.from(this.input.value + " ").forEach((char) => {
      const clone = this.charTemplate.content.cloneNode(true) as DocumentFragment;
      const charSpan = clone.querySelector("span");
      if (!charSpan) return;
      charSpan.innerText = char;
      this.commandDisplay.append(charSpan);
    });
  };

  private setCaret(selectionStart: number | null, selectionEnd: number | null): void {
    if (selectionStart === null || selectionEnd === null) return;
    const chars = Array.from(this.commandDisplay.querySelectorAll("span"));
    chars.forEach((e) => e.classList.remove("active"));
    const activeChars = chars.slice(selectionStart, selectionEnd + 1);
    activeChars.forEach((e) => e.classList.add("active"));
  }

  private setValue(string: string = ""): void {
    this.input.value = string;
    this.setChar();
    this.input.selectionStart = this.input.value.length;
    this.input.selectionEnd = this.input.value.length + 1;
    this.setCaret(this.input.selectionStart, this.input.selectionEnd);
  }

  private getCommand(): CalledCommand {
    const { value } = this.input;
    if (value === "")
      return {
        command: [""],
      };
    this.setValue();
    return {
      command: value.split(" "),
    };
  }

  private async excCommand(command: CalledCommand): Promise<void> {
    if (command.command.join(" ") === "clear") {
      this.callHistory = [];
      this.clearHistory();
      return;
    }
    const result = await this.parseCommand(command);
    this.callHistory.push({
      ...command,
      result,
    });
    this.appendHistory({
      ...command,
      result,
    });
  }

  private async parseCommand(command: CalledCommand): Promise<CommandResult> {
    const [commandName, ...args] = command.command;
    if (commandName === "") {
      return {
        contentType: "text/text",
        body: ``,
      };
    }
    try {
      const Command = (this.commands as any)[commandName];
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
  }

  private appendHistory(command: CalledCommand): void {
    const historyEl = this.document.querySelector<HTMLUListElement>("#history");
    const historyItem = this.document.querySelector<HTMLTemplateElement>(
      "template#command_history_item",
    );
    if (!historyEl || !historyItem || !("content" in historyItem)) return;
    const clone = historyItem.content.cloneNode(true) as DocumentFragment;
    const li = clone.querySelector<HTMLLIElement>("li");
    const commandElement = clone.querySelector<HTMLLIElement>(
      "li > div.command_wrap > div.command",
    );
    const resultElement = clone.querySelector<HTMLLIElement>("li > div.result");
    if (!li || !commandElement || !resultElement) return;
    commandElement.innerText = command.command.join(" ");
    if (command.result) {
      if (command.result.contentType === "text/html") {
        const shadowRoot = resultElement.attachShadow({ mode: "open" });
        this.insertResultHtml(shadowRoot, command.result);
      } else {
        resultElement.innerText = command.result ? command.result.body.toString() : "";
      }
    }
    historyEl.append(li);
  }

  private clearHistory(): void {
    const historyEl = this.document.querySelector<HTMLUListElement>("#history");
    if (!historyEl) return;
    historyEl.querySelectorAll("*").forEach((e) => e.remove());
  }

  public clear = this.clearHistory;

  private insertResultHtml(element: ShadowRoot, commandResult: CommandResult): ShadowRoot {
    if (!commandResult || commandResult.contentType !== "text/html") return element;
    const resultHtml = commandResult.body;
    const content = resultHtml.cloneNode(true) as DocumentFragment;
    const scripts = Array.from(content.querySelectorAll<HTMLScriptElement>("script"));
    scripts.forEach((oldScript) => {
      const newScript = this.terminalDoc.createElement("script");
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
  }

  public setRoot(root: HTMLElement | Document): this {
    this.root = root;
    return this;
  }

  public open(): void {
    if (!this.root) throw new Error();
    this.root.append(...this.terminalDoc.body.childNodes);
  }
}
