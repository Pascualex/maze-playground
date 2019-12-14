import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { Pathfinder } from './Pathfinder';
import { BFSPathfinder } from './BFSPathfinder';
import { TileType } from './TileType';

export class Grid {
  private htmlCanvas: HTMLCanvasElement;
  private gridModel: GridModel;
  private gridView: GridView;
  private pathfinder: Pathfinder;
  private currentTileType: TileType;

  constructor(htmlCanvas: HTMLCanvasElement, tileSize: number) {
    this.htmlCanvas = htmlCanvas;

    const gridWidth: number = Math.floor((htmlCanvas.width - 1) / (tileSize + 1));
    const gridHeight: number = Math.floor((htmlCanvas.height - 1) / (tileSize + 1));

    this.gridModel = new GridModel(gridWidth, gridHeight);
    this.gridView = new GridView(htmlCanvas, tileSize, this.gridModel);
    this.pathfinder = new BFSPathfinder(this.gridModel);

    this.currentTileType = TileType.Floor;

    this.setupEvents();

    this.gridView.draw();
  }

  public reset(tileSize: number): void {
    const gridWidth: number = Math.floor((this.htmlCanvas.width - 1) / (tileSize + 1));
    const gridHeight: number = Math.floor((this.htmlCanvas.height - 1) / (tileSize + 1));

    this.gridModel.reset(gridWidth, gridHeight);
    this.gridView.reset(tileSize);
    this.pathfinder.reset();

    this.currentTileType = TileType.Floor;

    this.gridView.draw();
  }

  public runPathfinder(): void {
    if (!this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }
    this.pathfinder.run();
  }

  private setupEvents(): void {
    this.gridView.ontiletypeselect = (x: number, y: number) => {
      this.handleOnTileTypeSelectEvent(x, y);
    };
    this.gridView.ontileclick = (x: number, y: number) => {
      this.handleOnTileClickEvent(x, y);
    };
    this.pathfinder.onstep = (x: number, y: number) => {
      this.handleOnStep(x, y);
    };
  }

  private handleOnTileTypeSelectEvent(x: number, y: number): void {
    const newTileType: TileType | null = this.gridModel.getTypeAt(x, y);
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

    if (!this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }
  }

  private handleOnTileClickEvent(x: number, y: number): void {
    const tileType: TileType | null = this.gridModel.getTypeAt(x, y);

    if (tileType == null) return;
    if (tileType == this.currentTileType) return;

    if (tileType == TileType.Entry || tileType == TileType.Exit) {
      this.gridModel.setTypeAt(x, y, this.currentTileType);
    } else if (this.currentTileType == TileType.Entry) {
      const oldEntryTileX = this.gridModel.getEntryTileX();
      const oldEntryTileY = this.gridModel.getEntryTileY();
      this.gridModel.setTypeAt(x, y, TileType.Entry);
      this.gridView.drawTileAndNeighbours(x, y);
      this.gridView.drawTileAndNeighbours(oldEntryTileX, oldEntryTileY);
    } else if (this.currentTileType == TileType.Exit) {
      const oldExitTileX = this.gridModel.getExitTileX();
      const oldExitTileY = this.gridModel.getExitTileY();
      this.gridModel.setTypeAt(x, y, TileType.Exit);
      this.gridView.drawTileAndNeighbours(x, y);  
      this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);      
    } else {
      this.gridModel.setTypeAt(x, y, this.currentTileType);
      this.gridView.drawTileAndNeighbours(x, y);
    }

    if (!this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }
  }

  private handleOnStep(x: number, y: number): void {
    this.gridView.drawTile(x, y);
  }
}