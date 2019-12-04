import { Grid } from './Grid'

let grid: Grid | null;
let resizeMessage : HTMLElement | null;

function createGrid(): void {  
  const htmlGrid : HTMLElement | null = document.getElementById('grid');
  resizeMessage = document.getElementById('resize-message');
  const resizeMessageYes = document.getElementById('resize-message-yes');
  const resizeMessageNo = document.getElementById('resize-message-no');
  
  if (htmlGrid instanceof HTMLCanvasElement) {
    setupCanvas(htmlGrid);
    htmlGrid.width = window.innerWidth - 4;
    htmlGrid.height = window.innerHeight - 4;
    grid = new Grid(htmlGrid, 32);
  } else {
    grid = null;
  }

  if (resizeMessageYes instanceof HTMLAnchorElement) {
    resizeMessageYes.onclick = () => closeResizeMessage(true);
  }

  if (resizeMessageNo instanceof HTMLAnchorElement) {
    resizeMessageNo.onclick = () => closeResizeMessage(false);
  }
}

function openResizeMessage(): void {
  if (resizeMessage != null) {
    resizeMessage.style.display = 'block';
  }
}

function closeResizeMessage(reset: boolean): void {
  if (reset) createGrid();
  if (resizeMessage != null) {
    resizeMessage.style.display = 'none';
  }
}

function setupCanvas(htmlGrid: HTMLCanvasElement): void {
  htmlGrid.addEventListener('touchstart', function (e) {
    const mousePos = getTouchPos(htmlGrid, e);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener('touchend', function (e) {
    const mouseEvent = new MouseEvent('mouseup', {});
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener('touchmove', function (e) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
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
  openResizeMessage();
}

