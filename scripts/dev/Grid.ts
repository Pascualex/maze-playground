import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { TileType } from './TileType';

export class Grid {
  private gridModel: GridModel;
  private gridView: GridView;
  private currentTileType: TileType;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    const gridHeight = Math.floor((htmlCanvas.width - 1) / (tileSize + 1));
    const gridWidth = Math.floor((htmlCanvas.height - 1) / (tileSize + 1));

    this.gridModel = new GridModel(gridHeight, gridWidth);
    this.gridView = new GridView(htmlCanvas, tileSize, this.gridModel);

    this.currentTileType = TileType.Floor;

    this.setupEvents();
    this.gridView.paint();
  }

  private setupEvents() {
    this.gridView.ontiletypeselect = (x: number, y: number) => {
      this.handleOnTileTypeSelectEvent(x, y);
    };
    this.gridView.ontileclick = (x: number, y: number) => {
      this.handleOnTileClickEvent(x, y);
    };
  }

  private handleOnTileTypeSelectEvent(x: number, y: number): void {
    const newTileType: TileType | null = this.gridModel.getTileAt(x, y);
    if (newTileType != null) {
      if (newTileType == TileType.Floor) {
        this.currentTileType = TileType.Wall;
      } else {
        this.currentTileType = TileType.Floor;
      }
    }
  }

  private handleOnTileClickEvent(x: number, y: number): void {
    const tileType: TileType | null = this.gridModel.getTileAt(x, y);
    if (tileType != null && tileType != this.currentTileType) {
      this.gridModel.setTileAt(x, y, this.currentTileType);
      this.gridView.paintTileAndNeighbours(x, y);
    }
  }
}