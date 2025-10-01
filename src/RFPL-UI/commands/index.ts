import { Echo } from "./Echo";
import { Time } from "./Time";
import { None } from "./None";
import { Fetch } from "./Fetch";
import { Call } from "./call";

const commands = {
  [Echo.commandName]: Echo,
  [Time.commandName]: Time,
  [None.commandName]: None,
  [Fetch.commandName]: Fetch,
  [Call.commandName]: Call,
};

const alias = {
  null: None,
};

export default {
  ...commands,
  ...alias,
};
