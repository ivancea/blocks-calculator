import isNil from "lodash/isNil";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if (isNil(canvas)) {
  throw new Error("Canvas element not found");
}

const errors = document.getElementById("errors") as HTMLDivElement;

if (isNil(errors)) {
  throw new Error("Errors element not found");
}

function configureCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
}

configureCanvas();
document.body.addEventListener("resize", configureCanvas);

export { canvas, errors };
