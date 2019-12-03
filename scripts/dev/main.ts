import { Grid } from "./Grid"

let grid: Grid | null;

function createGrid(): void {  
  let htmlGrid : HTMLElement | null = document.getElementById("grid");
  if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
    setupCanvas(htmlGrid);
    htmlGrid.width = window.innerWidth - 4;
    htmlGrid.height = window.innerHeight - 4;
    grid = new Grid(htmlGrid, 32);
  } else {
    grid = null;
  }
}

function setupCanvas(htmlGrid: HTMLCanvasElement): void {
  htmlGrid.addEventListener("touchstart", function (e) {
    const mousePos = getTouchPos(htmlGrid, e);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener("touchend", function (e) {
    const mouseEvent = new MouseEvent("mouseup", {});
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener("touchmove", function (e) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  function getTouchPos(canvasDom: HTMLCanvasElement, touchEvent: TouchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }
}

window.onload = () => {
  createGrid();
}

window.onresize = () => {
  createGrid();
}

