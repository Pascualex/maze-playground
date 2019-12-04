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
    this.gridView.draw();
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
      if (newTileType == TileType.Wall) {
        this.currentTileType = TileType.Floor;
      } else if (newTileType == TileType.Entry) {
        this.currentTileType = TileType.Entry;
      } else if (newTileType == TileType.Exit) {
        this.currentTileType = TileType.Exit;
      } else {
        this.currentTileType = TileType.Wall;
      }
    }
  }

  private handleOnTileClickEvent(x: number, y: number): void {
    const tileType: TileType | null = this.gridModel.getTileAt(x, y);

    if (tileType == null) return;
    if (tileType == this.currentTileType) return;
    if (tileType == TileType.Entry) return;
    if (tileType == TileType.Exit) return;
    
    if (this.currentTileType == TileType.Entry) {
      const oldEntryTileX = this.gridModel.getExtryTileX();
      const oldEntryTileY = this.gridModel.getExtryTileY();
      this.gridModel.setTileAt(x, y, TileType.Entry);
      this.gridView.drawTileAndNeighbours(x, y);
      this.gridView.drawTileAndNeighbours(oldEntryTileX, oldEntryTileY);
    } else if (this.currentTileType == TileType.Exit) {
      const oldExitTileX = this.gridModel.getExitTileX();
      const oldExitTileY = this.gridModel.getExitTileY();
      this.gridModel.setTileAt(x, y, TileType.Exit);
      this.gridView.drawTileAndNeighbours(x, y);  
      this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);      
    } else {
      this.gridModel.setTileAt(x, y, this.currentTileType);
      this.gridView.drawTileAndNeighbours(x, y);
    }
  }
}