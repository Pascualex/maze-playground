import { Grid } from "./Grid"

let grid: Grid;

window.onload = () => {
  let htmlGrid : HTMLElement | null = document.getElementById("grid");
  if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
    htmlGrid.width = window.innerWidth - 4;
    htmlGrid.height = window.innerHeight - 4;
    grid = new Grid(htmlGrid, 32);
  }
}