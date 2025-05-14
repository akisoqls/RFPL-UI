import { Command, type CommandResult } from "../../../Command";
import html from "./time.html?raw";

export class Time extends Command {
  commandName: string = "time";
  args: undefined;
  result: CommandResult = {
    result: null,
  };
  htmlElement: HTMLElement;

  constructor() {
    super();
    this.htmlElement = document.createElement("div");
  }

  async exec(): Promise<this> {
    console.log({ html });
    this.htmlElement.innerHTML = html;
    this.result.result = {
      contentType: "text/html",
      body: this.htmlElement,
    };
    return this;
  }
}
