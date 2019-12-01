import { TileType } from './TileType'

export class GridData {
  private width: number;
  private height: number;
  private tiles: TileType[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Array<TileType[]>(height);

    for (let i = 0; i < height; i++) {
      this.tiles[i] = new Array<TileType>(width);
      for (let j = 0; j < width; j++) {
        this.tiles[i][j] = TileType.Floor;
      }
    }
  }

  public getTileAt(x: number, y: number): TileType {
    return this.tiles[y][x];
  }

  public setTileAt(x: number, y: number, tileType: TileType): void {
    this.tiles[y][x] = tileType;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}