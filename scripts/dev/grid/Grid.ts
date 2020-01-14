import { GridModel } from './GridModel';
import { GridView } from './GridView';
import { Pathfinder } from '../pathfinder/Pathfinder';
import { Builder } from '../builder/Builder';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Direction } from '../utils/Direction';
import { Constants } from '../utils/Constants'

export class Grid {
  private htmlCanvas: HTMLCanvasElement;
  private gridModel: GridModel;
  private gridView: GridView;
  private pathfinder: Pathfinder | null;
  private builder: Builder | null;
  private currentTileType: TileType;
  private stepDelay: number;

  constructor(htmlCanvas: HTMLCanvasElement, scale: number) {
    this.htmlCanvas = htmlCanvas;

    const realTileSize: number = (Constants.TileSize * scale) + 1
    const gridWidth: number = Math.floor((htmlCanvas.width - 1) / realTileSize);
    const gridHeight: number = Math.floor((htmlCanvas.height - 1) / realTileSize);

    this.gridModel = new GridModel(gridWidth, gridHeight);
    this.gridView = new GridView(htmlCanvas, scale, this.gridModel);
    this.pathfinder = null;
    this.builder = null;
    this.currentTileType = TileType.Floor;
    this.stepDelay = 50;

    this.setupEvents();

    this.gridView.draw();
  }

  public reset(scale: number): void {
    const realTileSize: number = (Constants.TileSize * scale) + 1
    const gridWidth: number = Math.floor((this.htmlCanvas.width - 1) / realTileSize);
    const gridHeight: number = Math.floor((this.htmlCanvas.height - 1) / realTileSize);

    this.gridModel.reset(gridWidth, gridHeight);
    this.gridView.reset(scale);
    if (this.pathfinder != null) this.pathfinder.reset();
    if (this.builder != null) this.builder.reset();

    this.currentTileType = TileType.Floor;

    this.gridView.draw();
  }

  public setPathfinder(pathfinder: Pathfinder): void {
    if (pathfinder == this.pathfinder) return;

    if (this.pathfinder != null) {
      this.unsetPathfinderEvents();

      if (!this.pathfinder.isUnactivated()) {
        this.gridModel.resetStates();
        this.gridView.draw();
        this.pathfinder.reset();
      }
    }

    this.pathfinder = pathfinder;
    this.pathfinder.setGridModel(this.gridModel);
    this.pathfinder.setStepDelay(this.stepDelay);
    this.setupPathfinderEvents();
  }

  public runPathfinder(): void {
    if (this.pathfinder == null) return;

    if (!this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }

    if (this.builder != null && !this.builder.isUnactivated()) {
      this.builder.reset();
    }

    this.pathfinder.run();
  }

  public setBuilder(builder: Builder): void {
    if (this.builder != null) {
      this.unsetBuilderEvents();
    }

    this.builder = builder;
    this.builder.setGridModel(this.gridModel);
    this.builder.setStepDelay(this.stepDelay);
    this.setupBuilderEvents();
  }

  public runBuilder(): void {
    if (this.builder == null) return;

    if (!this.builder.isUnactivated()) {
      this.builder.reset();
    }

    if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.pathfinder.reset();
    }

    this.gridModel.resetTiles();
    this.gridView.draw();
    this.builder.run();
  }

  public setStepDelay(stepDelay: number): void {
    this.stepDelay = stepDelay;
    if (this.builder != null) this.builder.setStepDelay(stepDelay);
    if (this.pathfinder != null) this.pathfinder.setStepDelay(stepDelay);
  }

  private setupEvents(): void {
    this.gridView.ontiletypeselect = (x: number, y: number) => {
      this.handleOnTileTypeSelectEvent(x, y);
    };
    this.gridView.ontileclick = (x: number, y: number) => {
      this.handleOnTileClickEvent(x, y);
    };
  }

  private setupPathfinderEvents(): void {
    if (this.pathfinder == null) return;
    
    this.pathfinder.onstep = (x: number, y: number,  tileState: TileState, direction: Direction | null) => {
      this.handleOnPathfinderStep(x, y, tileState, direction);
    };
    this.pathfinder.onpathstep = (x: number, y: number,  tileState: TileState, direction: Direction | null) => {
      this.handleOnPathfinderPathStep(x, y, tileState, direction);
    };
  }

  private unsetPathfinderEvents(): void {
    if (this.pathfinder == null) return;
    
    this.pathfinder.onstep = null;
    this.pathfinder.onpathstep = null;
  }

  private setupBuilderEvents(): void {
    if (this.builder == null) return;

    this.builder.onstep = (x: number, y: number, tileType: TileType) => {
      this.handleOnBuilderStep(x, y, tileType);
    }
  }

  private unsetBuilderEvents(): void {
    if (this.builder == null) return;
    
    this.builder.onstep = null;
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

    if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }

    if (this.builder != null && !this.builder.isUnactivated()) {
      this.builder.reset();
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

    if (this.pathfinder != null && !this.pathfinder.isUnactivated()) {
      this.gridModel.resetStates();
      this.gridView.draw();
      this.pathfinder.reset();
    }

    if (this.builder != null && !this.builder.isUnactivated()) {
      this.builder.reset();
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

  private handleOnBuilderStep(x: number, y: number, tileType: TileType): void {
    if (tileType == TileType.Entry) {
      const oldExitTileX = this.gridModel.getEntryTileX();
      const oldExitTileY = this.gridModel.getEntryTileY();
      this.gridModel.setTypeAt(x, y, TileType.Entry);
      this.gridView.drawTileAndNeighbours(x, y);  
      this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);   
    } else if (tileType == TileType.Exit) {
      const oldExitTileX = this.gridModel.getExitTileX();
      const oldExitTileY = this.gridModel.getExitTileY();
      this.gridModel.setTypeAt(x, y, TileType.Exit);
      this.gridView.drawTileAndNeighbours(x, y);  
      this.gridView.drawTileAndNeighbours(oldExitTileX, oldExitTileY);   
    } else {
      this.gridModel.setTypeAt(x, y, tileType);
      this.gridView.drawTileAndNeighbours(x, y);
    }
  }
}