import { GridModel } from './GridModel';
import { TileType } from './TileType';

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

  public ontiletypeselect: ((x: number, y: number) => any) | null;
  public ontileclick: ((x: number, y: number) => any) | null;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number, gridModel: GridModel) {
    this.canvas = htmlCanvas.getContext('2d');

    this.tileSize = tileSize;
    this.width = htmlCanvas.width;
    this.height = htmlCanvas.height;
    this.offsetX = Math.floor(((this.width - 1) % (tileSize + 1)) / 2);
    this.offsetY = Math.floor(((this.height - 1) % (tileSize + 1)) / 2);
    
    this.gridHeight = Math.floor((this.width - 1) / (tileSize + 1));
    this.gridWidth = Math.floor((this.height - 1) / (tileSize + 1));

    this.gridModel = gridModel;

    this.mousePressed = false;

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

  public paint(): void {
    if (this.canvas == null) return;

    for (let i = 0; i < this.gridModel.getHeight(); i++) {
      for (let j = 0; j < this.gridModel.getWidth(); j++) {
        this.paintTile(j, i);
      }
    }
  }

  public paintTile(x: number, y: number): void {
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
    } else {
      let xStartOffset = 0;
      let yStartOffset = 0;
      let xSizeOffset = 0;
      let ySizeOffSet = 0;
      
      if (this.gridModel.getTileAt(x, y-1) == TileType.Wall) {
        yStartOffset++;
        ySizeOffSet++;
      }
      if (this.gridModel.getTileAt(x+1, y) == TileType.Wall) {
        xSizeOffset++;
      }
      if (this.gridModel.getTileAt(x, y+1) == TileType.Wall) {
        ySizeOffSet++;
      }
      if (this.gridModel.getTileAt(x-1, y) == TileType.Wall) {
        xStartOffset++;
        xSizeOffset++;
      }

      this.canvas.fillStyle = '#6da6b3';
      const finalXStart = xStart + xStartOffset;
      const finalYStart = yStart + yStartOffset;
      const finalXSize = xSize - xSizeOffset;
      const finalYSize = ySize - ySizeOffSet;
      this.canvas.fillRect(finalXStart, finalYStart, finalXSize, finalYSize);

      this.canvas.fillStyle = '#FFFFFF';
      this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
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

  private handleOnMouseDownEvent(event: MouseEvent): void {
    this.mousePressed = true;
    this.triggerOnTileTypeSelectEvent(event);    
    this.triggerOnTileClickEvent(event);    
  }

  private handleOnMouseMoveEvent(event: MouseEvent): void {
    if (this.mousePressed) {
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
    if (this.ontiletypeselect != null) {
      const x = this.coordinateXToTile(event.offsetX);
      const y = this.coordinateYToTile(event.offsetY); 
      
      if (x < 0 || x >= this.gridWidth) return;
      if (y < 0 || y >= this.gridHeight) return;
  
      this.ontiletypeselect(x, y);
    }
  }

  private triggerOnTileClickEvent(event: MouseEvent): void {
    if (this.ontileclick != null) {
      const x = this.coordinateXToTile(event.offsetX);
      const y = this.coordinateYToTile(event.offsetY); 
      
      if (x < 0 || x >= this.gridWidth) return;
      if (y < 0 || y >= this.gridHeight) return;
  
      this.ontileclick(x, y);
    }
  }
}