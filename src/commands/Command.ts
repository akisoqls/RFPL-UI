export class Command {
  private args: string[] | undefined;

  constructor() {}
  exec(args: string[] | undefined) {
    this.args = args;
  }
}
