import { Grid } from './grid/Grid';
import { ControlBar } from './controlbar/ControlBar';
import { Pathfinder } from './pathfinder/Pathfinder';
import { BFSPathfinder } from './pathfinder/BFSPathfinder';
import { DFSPathfinder } from './pathfinder/DFSPathfinder';
import { Builder } from './builder/Builder';
import { BuilderX } from './builder/BuilderX';

let grid: Grid | null;
let controlBar: ControlBar | null;
let htmlGrid: HTMLElement | null;
let header: HTMLElement | null;
let builderSelect : HTMLElement | null;
let generateButton : HTMLElement | null;
let pathfinderSelect : HTMLElement | null;
let findButton : HTMLElement | null;
let resetButton : HTMLElement | null;
let resizeMessage : HTMLElement | null;

window.onload = () => {
  setupHtmlElements();
  createControlBar();
  setupControlBarEvents();
  setupTouchEvents();
  createGrid();
}

window.onresize = () => {
  openResizeMessage();
}

function createGrid(): void {    
  if (htmlGrid instanceof HTMLCanvasElement && header != null) {
    let scale: number = 1;
    htmlGrid.width = window.innerWidth;
    htmlGrid.height = window.innerHeight - header.clientHeight;
    if ((window.innerWidth / window.devicePixelRatio) <= 600) scale = 2;
    grid = new Grid(htmlGrid, scale);
    if (controlBar != null) {
      const defaultPathfinder: Pathfinder | null = controlBar.getDefaultPathfinder();
      const defaultBuilder: Builder | null = controlBar.getDefaultBuilder();
      if (defaultPathfinder != null) grid.setPathfinder(defaultPathfinder);
      if (defaultBuilder != null) grid.setBuilder(defaultBuilder);
    }
  } else {
    grid = null;
  }
}

function resetGrid(): void {
  if (htmlGrid instanceof HTMLCanvasElement && header != null) {
    let scale: number = 1;
    htmlGrid.width = window.innerWidth;
    htmlGrid.height = window.innerHeight - header.clientHeight;
    if ((window.innerWidth / window.devicePixelRatio) <= 600) scale = 2;
    if (grid != null) grid.reset(scale);
  }
}

function createControlBar(): void {
  controlBar = null;

  if (!(builderSelect instanceof HTMLSelectElement)) return;
  if (!(generateButton instanceof HTMLAnchorElement)) return;
  if (!(pathfinderSelect instanceof HTMLSelectElement)) return;
  if (!(findButton instanceof HTMLAnchorElement)) return;
  if (!(resetButton instanceof HTMLAnchorElement)) return;

  controlBar = new ControlBar(
    builderSelect,
    generateButton,
    pathfinderSelect,
    findButton,
    resetButton
  );

  controlBar.addBuilder("Builder X", new BuilderX());

  controlBar.addPathfinder("BFS", new BFSPathfinder());
  controlBar.addPathfinder("DFS", new DFSPathfinder());
}

function handleOnBuilderChangeEvent(builder: Builder): void {
  if (grid != null) grid.setBuilder(builder);
}

function handleOnGenerateEvent(): void {
  if (grid != null) grid.runBuilder();
}

function handleOnPathfinderChangeEvent(pathfinder: Pathfinder): void {
  if (grid != null) grid.setPathfinder(pathfinder);
}

function handleOnFindEvent(): void {
  if (grid != null) grid.runPathfinder();
}

function handleOnResetEvent(): void {
  if (resizeMessage != null) {
    resizeMessage.style.display = 'none';
  }
  resetGrid();
}

function openResizeMessage(): void {
  if (resizeMessage != null) {
    resizeMessage.style.display = 'block';
  }
}

function closeResizeMessage(reset: boolean): void {
  if (reset && grid != null) resetGrid();
  if (resizeMessage != null) {
    resizeMessage.style.display = 'none';
  }
}

function setupHtmlElements(): void {
  htmlGrid = document.getElementById('grid');
  header = document.getElementById('header');
  builderSelect = document.getElementById('builder-select');
  generateButton = document.getElementById('generate-button');
  pathfinderSelect = document.getElementById('pathfinder-select');
  findButton = document.getElementById('find-button');
  resetButton = document.getElementById('reset-button');
  resizeMessage = document.getElementById('resize-message');
  const resizeMessageYes = document.getElementById('resize-message-yes');
  const resizeMessageNo = document.getElementById('resize-message-no');

  if (resizeMessageYes instanceof HTMLAnchorElement) {
    resizeMessageYes.onclick = () => closeResizeMessage(true);
  }

  if (resizeMessageNo instanceof HTMLAnchorElement) {
    resizeMessageNo.onclick = () => closeResizeMessage(false);
  }
}

function setupControlBarEvents(): void {
  if (controlBar == null) return;

  controlBar.onbuilderchange = (builder: Builder) => {
    handleOnBuilderChangeEvent(builder);
  };
  controlBar.ongenerate = () => {
    handleOnGenerateEvent();
  };
  controlBar.onpathfinderchange = (pathfinder: Pathfinder) => {
    handleOnPathfinderChangeEvent(pathfinder);
  };
  controlBar.onfind = () => {
    handleOnFindEvent();
  };
  controlBar.onreset = () => {
    handleOnResetEvent();
  };
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

