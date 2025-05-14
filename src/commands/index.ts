import { Echo } from "./Echo/Echo";
import { Time } from "./Time/Time";
import { None } from "./None/None";

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
