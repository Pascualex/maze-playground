import { TileType } from './TileType';

export class GridModel {
  private width: number;
  private height: number;
  private tiles: TileType[][];
  private entryTileX!: number;
  private entryTileY!: number;
  private entryPreviousTile!: TileType;
  private exitTileX!: number;
  private exitTileY!: number;
  private exitPreviousTile!: TileType;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.tiles = new Array<TileType[]>(height);
    this.clear();
  }

  public clear(): void {    
    for (let i = 0; i < this.height; i++) {
      this.tiles[i] = new Array<TileType>(this.width);
      for (let j = 0; j < this.width; j++) {
        this.tiles[i][j] = TileType.Floor;
      }
    }

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

  public getTileAt(x: number, y: number): TileType | null {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;
    
    return this.tiles[y][x];
  }

  public setTileAt(x: number, y: number, tileType: TileType): void {
    if (x < 0 || x >= this.width) return;
    if (y < 0 || y >= this.height) return;

    if (tileType == TileType.Entry) this.setEntryTileAt(x, y);
    else if (tileType == TileType.Exit) this.setExitTileAt(x, y);
    else this.tiles[y][x] = tileType;
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