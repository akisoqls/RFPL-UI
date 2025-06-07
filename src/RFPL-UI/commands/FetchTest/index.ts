import type { CommandResult } from "../../Command";
import { FetchCommand } from "../../Command/fetch";

export class FetchTest extends FetchCommand {
  static commandName: string = "fetchtest";
  args: string[] | undefined;
  result: CommandResult = {
    result: null,
  };
  htmlElement: HTMLElement;

  constructor() {
    super();
    this.htmlElement = document.createElement("div");
  }

  public async exec(): Promise<this> {
    const testRes = await fetch("/test/test.html");
    const htmlText = await testRes.text();

    this.htmlElement.innerHTML = htmlText;
    this.result.result = {
      contentType: "text/html",
      body: this.htmlElement,
    };

    return this;
  }
}
