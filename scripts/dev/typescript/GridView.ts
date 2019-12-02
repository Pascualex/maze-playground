import { GridModel } from './GridModel';
import { TileType } from './TileType';

export class GridView {
  private canvas: CanvasRenderingContext2D | null;

  private tileSize: number;
  private width: number;
  private height: number;
  private xOffset: number;
  private yOffset: number;

  private gridHeight: number;
  private gridWidth: number;

  private gridModel: GridModel;

  public ontileclick: ((x: number, y: number) => any) | null;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number, gridModel: GridModel) {
    this.canvas = htmlCanvas.getContext('2d');

    this.tileSize = tileSize;
    this.width = htmlCanvas.width;
    this.height = htmlCanvas.height;
    this.xOffset = Math.floor(this.width % tileSize / 2);
    this.yOffset = Math.floor(this.height % tileSize / 2);
    
    this.gridHeight = Math.floor(htmlCanvas.width / tileSize);
    this.gridWidth = Math.floor(htmlCanvas.height / tileSize);

    this.gridModel = gridModel;

    this.ontileclick = null;

    this.setupEvents(htmlCanvas);
  }

  private setupEvents(htmlCanvas: HTMLCanvasElement): void {
    htmlCanvas.onclick = (event: MouseEvent) => {
      this.manageOnClickEvent(event);
    };
  }

  public paintTile(x: number, y: number): void {
    if (this.canvas == null) return;
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    const tileType: TileType = this.gridModel.getTileAt(x, y)!;
    this.canvas.fillStyle = this.styleForTile(tileType);

    const xStart: number = this.xOffset + (x * this.tileSize);
    const yStart: number = this.yOffset + (y * this.tileSize);
    this.canvas.fillRect(xStart, yStart, this.tileSize, this.tileSize);
  }

  private styleForTile(tileType: TileType) {
    if (tileType == TileType.Floor) {
      return '#FFFFFF';
    } else {
      return '#000000';
    }
  }

  private manageOnClickEvent(event: MouseEvent): void {
    //console.log('GridCanvas click event in (' + event.clientX + ', ' + event.clientY + ')');
    if (this.ontileclick != null) {
      const x = Math.floor((event.clientX - this.xOffset) / this.tileSize);
      const y = Math.floor((event.clientY - this.yOffset) / this.tileSize);  
      
      if (x < 0 || x >= this.gridWidth) return;
      if (y < 0 || y >= this.gridHeight) return;
  
      this.ontileclick(x, y);
    }
  }
}