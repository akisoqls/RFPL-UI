import { Echo } from "./Echo";
import { Time } from "./Time";
import { None } from "./None";

const commands = {
  [Echo.commandName]: Echo,
  [Time.commandName]: Time,
  [None.commandName]: None,
};

const alias = {
  null: None,
};

export default {
  ...commands,
  ...alias,
};
