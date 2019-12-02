import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { TileType } from './TileType';

export class Grid {
  private gridModel: GridModel;
  private gridView: GridView;
  private currentTileType: TileType;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    const gridHeight = Math.floor(htmlCanvas.width / tileSize);
    const gridWidth = Math.floor(htmlCanvas.height / tileSize);

    this.gridModel = new GridModel(gridHeight, gridWidth);
    this.gridView = new GridView(htmlCanvas, tileSize, this.gridModel);

    this.currentTileType = TileType.Floor;

    this.setupEvents();
    this.gridView.paint();
  }

  private setupEvents() {
    this.gridView.ontiletypeselect = (x: number, y: number) => {
      this.manageOnTileTypeSelectEvent(x, y);
    };
    this.gridView.ontileclick = (x: number, y: number) => {
      this.manageOnTileClickEvent(x, y);
    };
  }

  private manageOnTileTypeSelectEvent(x: number, y: number): void {
    const newTileType: TileType | null = this.gridModel.getTileAt(x, y);
    if (newTileType != null) {
      if (newTileType == TileType.Floor) {
        this.currentTileType = TileType.Wall;
      } else {
        this.currentTileType = TileType.Floor;
      }
    }
  }

  private manageOnTileClickEvent(x: number, y: number): void {
    this.gridModel.setTileAt(x, y, this.currentTileType);
    this.gridView.paintTile(x, y);
  }
}