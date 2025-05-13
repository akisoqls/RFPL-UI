import { Echo } from "./Echo/Echo";
import { Time } from "./Time/Time";

const commands = {
  [Echo.name.toLowerCase()]: Echo,
  [Time.name.toLowerCase()]: Time,
};

export default commands;
