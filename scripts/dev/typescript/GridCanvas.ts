import { TileType } from './TileType'

export class GridCanvas {
  private canvas: CanvasRenderingContext2D | null;
  private tileSize: number;
  private width: number;
  private height: number;
  private xOffset: number;
  private yOffset: number;
  private gridHeight: number;
  private gridWidth: number;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    this.canvas = htmlCanvas.getContext('2d');
    this.tileSize = tileSize;
    this.width = htmlCanvas.width;
    this.height = htmlCanvas.height;
    this.xOffset = Math.floor(this.width % tileSize / 2);
    this.yOffset = Math.floor(this.height % tileSize / 2);
    this.gridHeight = Math.floor(htmlCanvas.width / tileSize);
    this.gridWidth = Math.floor(htmlCanvas.height / tileSize);
  }

  public paintTile(x: number, y: number, tileType: TileType): void {
    if (this.canvas == null) return;
    if (x < 0 || x >= this.gridWidth) return;
    if (y < 0 || y >= this.gridHeight) return;

    this.canvas.fillStyle = this.styleForTile(tileType);
    const xStart = this.xOffset + (x * this.tileSize);
    const yStart = this.yOffset + (y * this.tileSize);
    this.canvas.fillRect(xStart, yStart, this.tileSize, this.tileSize);
  }

  private styleForTile(tileType: TileType) {
    if (tileType == TileType.Floor) {
      return '#FFFFFF';
    } else {
      return '#000000';
    }
  }
}