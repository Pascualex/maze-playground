import { Grid } from './Grid'

let grid: Grid | null;
let htmlGrid: HTMLElement | null;
let resetButton : HTMLElement | null;
let resizeMessage : HTMLElement | null;

window.onload = () => {
  setupHtmlElements();
  setupTouchEvents();
  createGrid();
}

window.onresize = () => {
  openResizeMessage();
}

function createGrid(): void {    
  if (htmlGrid instanceof HTMLCanvasElement) {
    htmlGrid.width = window.innerWidth;
    htmlGrid.height = window.innerHeight;
    grid = new Grid(htmlGrid, 32);
  } else {
    grid = null;
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

function setupHtmlElements(): void {
  htmlGrid = document.getElementById('grid');
  resetButton = document.getElementById('reset-button');
  resizeMessage = document.getElementById('resize-message');
  const resizeMessageYes = document.getElementById('resize-message-yes');
  const resizeMessageNo = document.getElementById('resize-message-no');  

  if (resetButton instanceof HTMLAnchorElement) {
    resetButton.onclick = () => createGrid();
  }

  if (resizeMessageYes instanceof HTMLAnchorElement) {
    resizeMessageYes.onclick = () => closeResizeMessage(true);
  }

  if (resizeMessageNo instanceof HTMLAnchorElement) {
    resizeMessageNo.onclick = () => closeResizeMessage(false);
  }
}

function setupTouchEvents(): void {
  if (!(htmlGrid instanceof HTMLCanvasElement)) return;

  htmlGrid.addEventListener('touchstart', function (e) {
    if (!(htmlGrid instanceof HTMLCanvasElement)) return;
    const mousePos = getTouchPos(htmlGrid, e);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener('touchend', function (e) {
    if (!(htmlGrid instanceof HTMLCanvasElement)) return;
    const mouseEvent = new MouseEvent('mouseup', {});
    htmlGrid.dispatchEvent(mouseEvent);
  }, false);

  htmlGrid.addEventListener('touchmove', function (e) {
    if (!(htmlGrid instanceof HTMLCanvasElement)) return;
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

