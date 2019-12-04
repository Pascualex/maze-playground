import { GridModel } from './GridModel';
import { TileType } from './TileType';

interface Coordinates {
  x: number;
  y: number;
}

export class GridView {
  private canvas: CanvasRenderingContext2D | null;

  private tileSize: number;
  private width: number;
  private height: number;
  private offsetX: number;
  private offsetY: number;

  private gridHeight: number;
  private gridWidth: number;

  private gridModel: GridModel;

  private mousePressed: boolean;
  private mousePressedLastX: number;
  private mousePressedLastY: number;

  public ontiletypeselect: ((x: number, y: number) => any) | null;
  public ontileclick: ((x: number, y: number) => any) | null;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number, gridModel: GridModel) {
    this.canvas = htmlCanvas.getContext('2d');

    this.tileSize = tileSize;
    this.width = htmlCanvas.width;
    this.height = htmlCanvas.height;
    this.offsetX = Math.floor(((this.width - 1) % (tileSize + 1)) / 2);
    this.offsetY = Math.floor(((this.height - 1) % (tileSize + 1)) / 2);

    console.log(this.width, (this.width - 1) % (tileSize + 1), this.offsetX);
    
    this.gridWidth = Math.floor((this.width - 1) / (tileSize + 1));
    this.gridHeight = Math.floor((this.height - 1) / (tileSize + 1));

    this.gridModel = gridModel;

    this.mousePressed = false;
    this.mousePressedLastX = 0;
    this.mousePressedLastY = 0;

    this.ontiletypeselect = null;
    this.ontileclick = null;
    this.setupEvents(htmlCanvas);
  }

  private setupEvents(htmlCanvas: HTMLCanvasElement): void {
    htmlCanvas.onmousedown = (event: MouseEvent) => {
      this.handleOnMouseDownEvent(event);
    };
    htmlCanvas.onmousemove = (event: MouseEvent) => {
      this.handleOnMouseMoveEvent(event);
    };
    htmlCanvas.onmouseup = (event: MouseEvent) => {
      this.handleOnMouseUpEvent(event);
    };
    htmlCanvas.onmouseleave = (event: MouseEvent) => {
      this.handleOnMouseLeaveEvent(event);
    };
  }

  public draw(): void {
    if (this.canvas == null) return;

    for (let i = 0; i < this.gridModel.getHeight(); i++) {
      for (let j = 0; j < this.gridModel.getWidth(); j++) {
        this.drawTile(j, i);
      }
    }
  }

  public drawTileAndNeighbours(x: number, y: number): void {
    this.drawTile(x, y);
    this.drawTile(x, y - 1);
    this.drawTile(x + 1, y);
    this.drawTile(x, y + 1);
    this.drawTile(x - 1, y);
  }

  public drawTile(x: number, y: number): void {
    if (this.canvas == null) return;
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    const xStart: number = this.tileToCoordinateX(x);
    const yStart: number = this.tileToCoordinateY(y);
    const xSize: number = this.tileSize + 2;
    const ySize: number = this.tileSize + 2;

    const tileType: TileType = this.gridModel.getTileAt(x, y)!;
    if (tileType == TileType.Wall) {
      this.canvas.fillStyle = '#0c264a';
      this.canvas.fillRect(xStart, yStart, xSize, ySize);
      this.canvas.fillStyle = '#42eb3f';
      this.printWallDetail(x, y);
    } else if (tileType == TileType.Floor) {
      this.clearTile(x, y);
      this.canvas.fillStyle = '#ffffff';
      this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
    } else if (tileType == TileType.Entry) {
      this.clearTile(x, y);
      this.canvas.fillStyle = '#ffffff';
      this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 14, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#0c264a';
      this.canvas.fill();
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 10, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#30b348';
      this.canvas.fill();
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 4, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#0c264a';
      this.canvas.fill();
    } else if (tileType == TileType.Exit) {
      this.clearTile(x, y);
      this.canvas.fillStyle = '#ffffff';
      this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 14, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#0c264a';
      this.canvas.fill();
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 10, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#f71b39';
      this.canvas.fill();
      this.canvas.beginPath();
      this.canvas.arc(xStart + 17, yStart + 17, 4, 0, 2 * Math.PI);
      this.canvas.fillStyle = '#0c264a';
      this.canvas.fill();
    } else {
      this.canvas.fillStyle = '#f01fff';
      this.canvas.fillRect(xStart, yStart, xSize, ySize);
    }
  }

  private clearTile(x: number, y: number): void {
    if (this.canvas == null) return;
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    let xStart: number = this.tileToCoordinateX(x);
    let yStart: number = this.tileToCoordinateY(y);
    let xSize: number = this.tileSize + 2;
    let ySize: number = this.tileSize + 2;
    
    if (this.gridModel.getTileAt(x, y - 1) == TileType.Wall) {
      yStart++;
      ySize--;
    }
    if (this.gridModel.getTileAt(x + 1, y) == TileType.Wall) {
      xSize--;
    }
    if (this.gridModel.getTileAt(x, y + 1) == TileType.Wall) {
      ySize--;
    }
    if (this.gridModel.getTileAt(x - 1, y) == TileType.Wall) {
      xStart++;
      xSize--;
    }

    this.canvas.fillStyle = '#6da6b3';
    this.canvas.fillRect(xStart, yStart, xSize, ySize);
  }

  private printWallDetail(x: number, y: number) {
    if (this.canvas == null) return;
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    const xStart: number = this.tileToCoordinateX(x);
    const yStart: number = this.tileToCoordinateY(y);
    const xSize: number = this.tileSize + 2;
    const ySize: number = this.tileSize + 2;

    const top: boolean = (this.gridModel.getTileAt(x, y - 1) == TileType.Wall);
    const right: boolean = (this.gridModel.getTileAt(x + 1, y) == TileType.Wall);
    const bottom: boolean = (this.gridModel.getTileAt(x, y + 1) == TileType.Wall);
    const left: boolean = (this.gridModel.getTileAt(x - 1, y) == TileType.Wall);

    this.canvas.fillStyle = '#3af0c8';
    if (right && left && !top && !bottom) {
      this.canvas.fillRect(xStart, yStart + 15, xSize, ySize - 30);
    } else if (top && bottom && !right && !left) {
      this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize);
    } else {
      this.canvas.fillRect(xStart + 13, yStart + 13, xSize - 26, ySize - 26);
      if (top) this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize - 23);
      if (right) this.canvas.fillRect(xStart + 23, yStart + 15, xSize - 23, ySize - 30);
      if (bottom) this.canvas.fillRect(xStart + 15, yStart + 23, xSize - 30, ySize - 23);
      if (left) this.canvas.fillRect(xStart, yStart + 15, xSize - 23, ySize - 30);
    }
  }

  private tileToCoordinateX(x: number): number {
    return this.offsetX + (x * (this.tileSize + 1));
  }

  private tileToCoordinateY(y: number): number {
    return this.offsetY + (y * (this.tileSize + 1));
  }

  private coordinateXToTile(coordinateX: number) {
    return Math.floor((coordinateX - (this.offsetX + 1)) / (this.tileSize + 1));
  }

  private coordinateYToTile(coordinateY: number) {
    return Math.floor((coordinateY - (this.offsetY + 1)) / (this.tileSize + 1));
  }

  private raytraceTiles(startX: number, startY: number, endX: number, endY: number): Coordinates[]  {    
    const distanceX: number = Math.abs(endX - startX);
    const distanceY: number = Math.abs(endY - startY);

    const xIncrement: number = (endX > startX) ? 1 : -1;
    const yIncrement: number = (endY > startY) ? 1 : -1;

    const tileCount: number = distanceX + distanceY + 1;
    let error: number = distanceX - distanceY;

    let x: number = startX;
    let y: number = startY;

    const crossedTiles: Coordinates[] = new Array<Coordinates>(tileCount);
    for (let i = 0; i < tileCount; i++) {
      crossedTiles[i] = {x, y};
      if (error > 0) {
        x += xIncrement;
        error -= distanceY * 2;
      } else {
        y += yIncrement;
        error += distanceX * 2;
      }
    }

    return crossedTiles;
  }

  private handleOnMouseDownEvent(event: MouseEvent): void {
    this.mousePressed = true;
    this.mousePressedLastX = event.offsetX;
    this.mousePressedLastY = event.offsetY;
    this.triggerOnTileTypeSelectEvent(event);
    this.triggerOnTileClickEvent(event);
  }

  private handleOnMouseMoveEvent(event: MouseEvent): void {
    const x = this.coordinateXToTile(event.offsetX);
    const y = this.coordinateYToTile(event.offsetY);

    const tileType: TileType | null = this.gridModel.getTileAt(x, y);

    if (tileType == TileType.Entry || tileType == TileType.Exit) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
    
    if (this.mousePressed) {
      const startX = this.coordinateXToTile(this.mousePressedLastX);
      const startY = this.coordinateYToTile(this.mousePressedLastY);
      const crossedTiles: Coordinates[] = this.raytraceTiles(startX, startY, x, y);
      this.triggerOnTileClickEvents(crossedTiles);
      this.mousePressedLastX = event.offsetX;
      this.mousePressedLastY = event.offsetY;
      this.triggerOnTileClickEvent(event);
    }
  }

  private handleOnMouseUpEvent(event: MouseEvent): void {
    this.mousePressed = false;
  }

  private handleOnMouseLeaveEvent(event: MouseEvent): void {
    this.mousePressed = false;
  }

  private triggerOnTileTypeSelectEvent(event: MouseEvent): void {
    if (this.ontiletypeselect == null) return;

    const x = this.coordinateXToTile(event.offsetX);
    const y = this.coordinateYToTile(event.offsetY); 
    
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    this.ontiletypeselect(x, y);
  }

  private triggerOnTileClickEvent(event: MouseEvent): void {
    if (this.ontileclick == null) return;

    const x = this.coordinateXToTile(event.offsetX);
    const y = this.coordinateYToTile(event.offsetY); 
    
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    this.ontileclick(x, y);
  }

  private triggerOnTileClickEvents(tiles: Coordinates[]): void {
    if (this.ontileclick == null) return;

    for (let i = 0; i < tiles.length; i++) {    
      if (tiles[i].x < 0 || tiles[i].x >= this.gridWidth) continue;
      if (tiles[i].y < 0 || tiles[i].y >= this.gridHeight) continue;

      this.ontileclick(tiles[i].x, tiles[i].y);
    }
  }
}