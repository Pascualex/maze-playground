import { GridData } from './GridData';
import { GridCanvas } from './GridCanvas';
import { TileType } from './TileType';

export class Grid {
  private gridData: GridData;
  private gridCanvas: GridCanvas;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    const gridHeight = Math.floor(htmlCanvas.width / tileSize);
    const gridWidth = Math.floor(htmlCanvas.height / tileSize);

    this.gridData = new GridData(gridHeight, gridWidth);
    this.gridCanvas = new GridCanvas(htmlCanvas, tileSize);
    
    // Only as a test
    for (let i = 0; i <= 5; i++) {
      this.gridData.setTileAt(3, 5+i, TileType.Wall);
    }

    this.paint();
  }

  private paint(): void {
    for (let i = 0; i < this.gridData.getHeight(); i++) {
      for (let j = 0; j < this.gridData.getWidth(); j++) {
        const tileType = this.gridData.getTileAt(j, i);
        this.gridCanvas.paintTile(j, i, tileType);
      }
    }
  }
}