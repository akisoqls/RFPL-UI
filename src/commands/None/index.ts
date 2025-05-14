import { Command, type CommandResult } from "../../Command";

export class None extends Command {
  commandName: string = "none";
  public result: CommandResult = null;
  public args: string[] | undefined;

  constructor() {
    super();
  }

  exec(): this {
    this.result = null;
    return this;
  }
}
