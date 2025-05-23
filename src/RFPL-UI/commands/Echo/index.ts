import { Command, type CommandResult } from "../../Command";

export class Echo extends Command {
  static commandName: string = "echo";
  args: string[] | undefined = [];
  result: CommandResult = {
    result: null,
  };
  constructor() {
    super();
  }

  exec(args: string[] | undefined) {
    this.args = args;
    this.result.result = {
      contentType: "text/text",
      body: (args || []).join(" "),
    };
    return this;
  }
}
