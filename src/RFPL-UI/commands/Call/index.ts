import type { CommandResult } from "../../Command";
import { FetchCommand } from "../../Command/fetch";

export class Call extends FetchCommand {
  static commandName: string = "call";
  args: string[] | undefined;
  result: CommandResult = {
    result: null,
  };
  htmlElement: HTMLIFrameElement;

  constructor() {
    super();
    this.htmlElement = document.createElement("iframe");
  }

  public async exec(args: string[]): Promise<this> {
    this.args = args;
    const proxy = import.meta.env["VITE_PROXY"]
    this.htmlElement.src = proxy + this.args[0];
    this.result.result = {
      contentType: "text/html",
      body: this.htmlElement,
    };

    return this;
  }
}
