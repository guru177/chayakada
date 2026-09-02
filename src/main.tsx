import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

function isInspectShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  if (event.key === "F12") return true;
  const mod = event.ctrlKey || event.metaKey;
  if (!mod) return false;
  if (key === "u") return true;
  if (!event.shiftKey) return false;
  return key === "i" || key === "j" || key === "c" || key === "k";
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  if (isInspectShortcut(event)) event.preventDefault();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
