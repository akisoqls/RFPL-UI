import { Command, type CommandResult } from "../../Command";

export class Echo extends Command {
  commandName: string = "echo";
  args: string[] | undefined = [];
  result: CommandResult = null;
  constructor() {
    super();
  }

  exec(args: string[] | undefined) {
    this.args = args;
    this.result = {
      contentType: "text/text",
      body: (args || []).join(" "),
    };
    return this;
  }
}
