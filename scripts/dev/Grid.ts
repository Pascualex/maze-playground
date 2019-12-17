import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { Pathfinder } from './Pathfinder';
import { BFSPathfinder } from './BFSPathfinder';
import { DFSPathfinder } from './DFSPathfinder';
import { LevelBuilder } from './LevelBuilder';
import { LevelBuilderX } from './LevelBuilderX';
import { TileType } from './TileType';
import { TileState } from './TileState';
import { Direction } from './Direction';
import { Constants } from './Constants'

export class Grid {
  private htmlCanvas: HTMLCanvasElement;
  private gridModel: GridModel;
  private gridView: GridView;
  private pathfinder: Pathfinder;
  private levelBuilder: LevelBuilder;
  private currentTileType: TileType;

  constructor(htmlCanvas: HTMLCanvasElement, scale: number) {
    this.htmlCanvas = htmlCanvas;

    const realTileSize: number = (Constants.TileSize * scale) + 1
    const gridWidth: number = Math.floor((htmlCanvas.width - 1) / realTileSize);
    const gridHeight: number = Math.floor((htmlCanvas.height - 1) / realTileSize);

    this.gridModel = new GridModel(gridWidth, gridHeight);
    this.gridView = new GridView(htmlCanvas, scale, this.gridModel);
    this.pathfinder = new BFSPathfinder(this.gridModel);
    this.levelBuilder = new LevelBuilderX(this.gridModel);

    this.currentTileType = TileType.Floor;

    this.setupEvents();

    this.gridView.draw();
  }

  public reset(scale: number): void {
    const realTileSize: number = (Constants.TileSize * scale) + 1
    const gridWidth: number = Math.floor((this.htmlCanvas.width - 1) / realTileSize);
    const gridHeight: number = Math.floor((this.htmlCanvas.height - 1) / realTileSize);

    this.gridModel.reset(gridWidth, gridHeight);
    this.gridView.reset(scale);
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
    if (!this.levelBuilder.isUnactivated()) {
      this.levelBuilder.reset();
    }
    this.pathfinder.run();
  }

  public runLevelBuilder(): void {
    if (!this.levelBuilder.isUnactivated()) {
      this.levelBuilder.reset();
    }
    if (!this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.pathfinder.reset();
    }
    this.gridModel.resetTiles();
    this.gridView.draw();
    this.levelBuilder.run();
  }

  private setupEvents(): void {
    this.gridView.ontiletypeselect = (x: number, y: number) => {
      this.handleOnTileTypeSelectEvent(x, y);
    };
    this.gridView.ontileclick = (x: number, y: number) => {
      this.handleOnTileClickEvent(x, y);
    };
    this.pathfinder.onstep = (x: number, y: number,  tileState: TileState, direction: Direction | null) => {
      this.handleOnPathfinderStep(x, y, tileState, direction);
    };
    this.pathfinder.onpathstep = (x: number, y: number,  tileState: TileState, direction: Direction | null) => {
      this.handleOnPathfinderPathStep(x, y, tileState, direction);
    };
    this.levelBuilder.onstep = (x: number, y: number, tileType: TileType) => {
      this.handleOnLevelBuilderStep(x, y, tileType);
    }
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

    if (!this.levelBuilder.isUnactivated()) {
      this.levelBuilder.reset();
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

    if (!this.levelBuilder.isUnactivated()) {
      this.levelBuilder.reset();
    }
  }

  private handleOnPathfinderStep(x: number, y: number, tileState: TileState, direction: Direction | null): void {
    this.gridModel.setStateAt(x, y, tileState);
    if (direction != null) this.gridModel.setDirectionAt(x, y, direction);
    this.gridView.drawTile(x, y);
  }

  private handleOnPathfinderPathStep(x: number, y: number, tileState: TileState, direction: Direction | null): void {
    this.gridModel.setStateAt(x, y, tileState);
    if (direction != null) this.gridModel.setDirectionAt(x, y, direction);
    this.gridView.drawTileAndNeighbours(x, y);
  }

  private handleOnLevelBuilderStep(x: number, y: number, tileType: TileType): void {
    this.gridModel.setTypeAt(x, y, tileType);
    this.gridView.drawTileAndNeighbours(x, y);
  }
}