export abstract class Command {
  static readonly commandName: string;
  abstract readonly args: string[] | undefined;
  abstract readonly result: CommandResult;
  abstract exec(args: string[] | undefined): this | Promise<this>;
}

export type ContentType = "text/text" | "text/html" | "text/json" | "data" | "unknown";

export type CommandResult = {
  skipHistory?: boolean;
  result: TextResult | HtmlResult | JsonResult | DataResult | null;
};

type TextResult = {
  contentType: "text/text";
  body: string;
};

type HtmlResult = {
  contentType: "text/html";
  body: HTMLElement;
};

type JsonResult = {
  contentType: "text/json";
  body: string;
};

type DataResult = {
  contentType: "data";
  body: Blob;
};
