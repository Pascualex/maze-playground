import { Grid } from "./Grid"

let grid: Grid;

window.onload = () => {
  let htmlGrid : HTMLElement | null = document.getElementById("grid");
  if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
    htmlGrid.width = window.innerWidth - 3;
    htmlGrid.height = window.innerHeight - 3;
    console.log('width', window.innerWidth, 'height', window.innerHeight);
    grid = new Grid(htmlGrid, 32);
  }
}