import "the-new-css-reset/css/reset.css";
import "./style.css";
import { Terminal } from "./Terminal";

const terminal = new Terminal();
const terminalRoot = document.querySelector<HTMLElement>("#terminal");
if (terminalRoot) {
  terminal.setWelcomeMessage(`Welcome to ${window.location.host}!`).setRoot(terminalRoot).open();
}
