export abstract class Command {
  static readonly commandName: string;
  abstract readonly args: string[] | undefined;
  abstract readonly result: CommandResult;
  abstract exec(args: string[] | undefined): this | Promise<this>;
}

export type CommandResult = {
  skipHistory?: boolean;
  result:
    | {
        contentType: "text/text";
        body: string;
      }
    | {
        contentType: "text/html";
        body: HTMLElement;
      }
    | {
        contentType: "text/json";
        body: string;
      }
    | {
        contentType: "data";
        body: Blob;
      }
    | null;
};
