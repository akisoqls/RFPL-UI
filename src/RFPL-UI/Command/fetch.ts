import { Command, type CommandResult } from ".";

export abstract class FetchCommand extends Command {
  static readonly commandName: string;
  abstract readonly args: string[] | undefined;
  abstract readonly result: CommandResult;
  abstract exec(args: string[]): Promise<this>;
}
