import { TileType } from './TileType';
import { TileState } from './TileState';

export class GridModel {
  private width!: number;
  private height!: number;
  private tiles!: TileType[][];
  private states!: TileState[][];
  private entryTileX!: number;
  private entryTileY!: number;
  private entryPreviousTile!: TileType;
  private exitTileX!: number;
  private exitTileY!: number;
  private exitPreviousTile!: TileType;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  public reset(width: number, height: number): void {    
    this.width = width;
    this.height = height;
    
    this.tiles = new Array<TileType[]>(height);
    this.states = new Array<TileState[]>(height);

    for (let i = 0; i < this.height; i++) {
      this.tiles[i] = new Array<TileType>(this.width);
      this.states[i] = new Array<TileState>(this.width);
    }

    this.resetTiles();
    this.resetStates();

    if (this.width < 5) return;
    if (this.height < 1) return;

    const xCenter: number = Math.floor((this.width - 1) / 2);
    const yCenter: number = Math.floor((this.height - 1) / 2);

    this.entryTileX = xCenter - 2;
    this.entryTileY = yCenter;
    this.entryPreviousTile = TileType.Floor;

    this.exitTileX = xCenter + 3 - (this.width % 2);
    this.exitTileY = yCenter;
    this.exitPreviousTile = TileType.Floor;
    
    this.tiles[this.entryTileY][this.entryTileX] = TileType.Entry;
    this.tiles[this.exitTileY][this.exitTileX] = TileType.Exit;
  }

  private resetTiles(): void {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.tiles[i][j] = TileType.Floor;
      }
    }
  }

  public resetStates(): void {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.states[i][j] = TileState.Undiscovered;
      }
    }
  }

  public getTileAt(x: number, y: number): TileType | null {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;
    
    return this.tiles[y][x];
  }

  public getStateAt(x: number, y: number): TileState | null {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;
    
    return this.states[y][x];
  }

  public setTileAt(x: number, y: number, tileType: TileType): void {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;

    const currentTileType: TileType = this.getTileAt(x, y)!;
    
    if (currentTileType == TileType.Entry) this.entryPreviousTile = tileType;
    else if (currentTileType == TileType.Exit) this.exitPreviousTile = tileType;
    else if (tileType == TileType.Entry) this.setEntryTileAt(x, y);
    else if (tileType == TileType.Exit) this.setExitTileAt(x, y);
    else this.tiles[y][x] = tileType;
  }

  public setStateAt(x: number, y: number, tileState: TileState): void {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;
    
    this.states[y][x] = tileState;
  }

  public setEntryTileAt(x: number, y: number): void {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;

    this.tiles[this.entryTileY][this.entryTileX] = this.entryPreviousTile;
    this.entryTileX = x;
    this.entryTileY = y;
    this.entryPreviousTile = this.tiles[y][x];
    this.tiles[y][x] = TileType.Entry;
  }

  public setExitTileAt(x: number, y: number): void {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;

    this.tiles[this.exitTileY][this.exitTileX] = this.exitPreviousTile;
    this.exitTileX = x;
    this.exitTileY = y;
    this.exitPreviousTile = this.tiles[y][x];
    this.tiles[y][x] = TileType.Exit;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getExtryTileX(): number {
    return this.entryTileX;
  }

  public getExtryTileY(): number {
    return this.entryTileY;
  }

  public getExitTileX(): number {
    return this.exitTileX;
  }

  public getExitTileY(): number {
    return this.exitTileY;
  }
}