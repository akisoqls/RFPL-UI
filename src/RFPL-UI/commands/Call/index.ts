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
    // const testRes = await fetch(args[0]);
    // const htmlText = await testRes.text();

    this.htmlElement.src = this.args[0];
    this.result.result = {
      contentType: "text/html",
      body: this.htmlElement,
    };

    return this;
  }
}
