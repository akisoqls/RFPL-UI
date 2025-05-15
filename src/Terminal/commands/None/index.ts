import { Command, type CommandResult } from "../../Command";

export class None extends Command {
  commandName: string = "none";
  result: CommandResult = {
    result: null,
  };
  public args: string[] | undefined;

  constructor() {
    super();
  }

  exec(): this {
    this.result.result = null;
    return this;
  }
}
