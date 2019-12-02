import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { TileType } from './TileType';

export class Grid {
  private gridModel: GridModel;
  private gridView: GridView;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    const gridHeight = Math.floor(htmlCanvas.width / tileSize);
    const gridWidth = Math.floor(htmlCanvas.height / tileSize);

    this.gridModel = new GridModel(gridHeight, gridWidth);
    this.gridView = new GridView(htmlCanvas, tileSize, this.gridModel);

    this.setupEvents();
    this.paint();
  }

  private setupEvents() {
    this.gridView.ontileclick = (x: number, y: number) => {
      this.manageOnTileClickEvent(x, y);
    };
  }

  private manageOnTileClickEvent(x: number, y: number): void {
    this.gridModel.setTileAt(x, y, TileType.Wall);
    this.gridView.paintTile(x, y);
  }

  private paint(): void {
    for (let i = 0; i < this.gridModel.getHeight(); i++) {
      for (let j = 0; j < this.gridModel.getWidth(); j++) {
        this.gridView.paintTile(j, i);
      }
    }
  }
}