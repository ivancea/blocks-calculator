import { errors } from "./html";

function showMessage(errorText: string, className: string) {
  const error = document.createElement("div");

  error.classList.add(className);
  error.innerText = errorText;

  const errorClose = document.createElement("button");
  errorClose.innerText = "X";
  errorClose.addEventListener("click", () => {
    error.remove();
  });

  error.appendChild(errorClose);

  errors.appendChild(error);
}

export function showError(text: string) {
  showMessage("❌ " + text, "error");
}

export function showWarn(text: string) {
  showMessage("⚠️ " + text, "warn");
}

export function showInfo(text: string) {
  showMessage(text, "info");
}
