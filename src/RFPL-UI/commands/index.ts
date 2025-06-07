import { Echo } from "./Echo";
import { Time } from "./Time";
import { None } from "./None";
import { FetchTest } from "./FetchTest";

const commands = {
  [Echo.commandName]: Echo,
  [Time.commandName]: Time,
  [None.commandName]: None,
  [FetchTest.commandName]: FetchTest,
};

const alias = {
  null: None,
};

export default {
  ...commands,
  ...alias,
};
