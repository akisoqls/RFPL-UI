import "the-new-css-reset/css/reset.css";
import "./style.css";
import { RFPLUI } from "./RFPL-UI";

const rfpl = new RFPLUI();
const rfplRoot = document.querySelector<HTMLElement>("#rfpl");
if (rfplRoot) {
  rfpl.setWelcomeMessage(`Welcome to ${window.location.host}!`).setRoot(rfplRoot).open();
}
