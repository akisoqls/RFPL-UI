import { Echo } from "./Echo";
import { Time } from "./Time";
import { None } from "./None";

const commands = {
  [Echo.name.toLowerCase()]: Echo,
  [Time.name.toLowerCase()]: Time,
  [None.name.toLowerCase()]: None,
};

const alias = {
  null: None,
};

export default {
  ...commands,
  ...alias,
};
