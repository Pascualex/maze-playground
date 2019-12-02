import { Grid } from "./Grid"

let grid: Grid;

window.onload = () => {
  let htmlGrid : HTMLElement | null = document.getElementById("grid");
  if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
    grid = new Grid(htmlGrid, 32);
  }
}