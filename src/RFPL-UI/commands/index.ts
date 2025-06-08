import { Echo } from "./Echo";
import { Time } from "./Time";
import { None } from "./None";
import { FetchTest } from "./FetchTest";
import { Call } from "./call";

const commands = {
  [Echo.commandName]: Echo,
  [Time.commandName]: Time,
  [None.commandName]: None,
  [FetchTest.commandName]: FetchTest,
  [Call.commandName]: Call,
};

const alias = {
  null: None,
};

export default {
  ...commands,
  ...alias,
};
