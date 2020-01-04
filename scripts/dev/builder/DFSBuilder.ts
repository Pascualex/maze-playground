import { TileType } from '../utils/TileType';
import { getExtendedDirections, getRandomizedDirections, getDirectionValue, invertDirection, Direction } from '../utils/Direction';
import { Builder } from './Builder';
import { Stack } from '../utils/Stack';
import { Pair } from '../utils/Pair';

export class DFSBuilder extends Builder {
  private width!: number;
  private height!: number;
  private tiles!: boolean[][];
  private directions!: Direction[][];
  private wall!: number;
  private wallBuilt!: boolean;
  private discoveredTiles: Stack<Pair>;

  constructor() {
    super();
    this.discoveredTiles = new Stack<Pair>();
    this.reset();
  }

  public reset(): void {
    super.reset();

    if (this.gridModel == null) {
      return;
    }

    this.width = this.gridModel.getWidth();
    if ((this.width % 2) == 0) this.width--;
    this.height = this.gridModel.getHeight();
    if ((this.height % 2) == 0) this.height--;

    this.tiles = new Array<boolean[]>(this.height);
    this.directions = new Array<Direction[]>(this.height);
    for (let i = 0; i < this.height; i++) {
      this.tiles[i] = new Array<boolean>(this.width);
      this.directions[i] = new Array<Direction>(this.width);
    }
  }

  protected initialization(): void {
    if (this.gridModel == null) {
      return;
    }

    this.wall = 0;
    this.wallBuilt = false;
    this.discoveredTiles.clear();
    this.discoveredTiles.push(new Pair(1, 1));

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.tiles[i][j] = false;
        this.directions[i][j] = Direction.None;
      }
    }

    if (this.onstep != null) this.onstep(1, 1, TileType.Entry);
    if (this.onstep != null) this.onstep(this.width - 2, this.height - 2, TileType.Exit);
  }

  protected step(): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    if (!this.wallBuilt) {
      this.buildWall();
      return;
    }

    let current: Pair;
    do {
      if (this.discoveredTiles.isEmpty()) {
        this.running = false;
        return;
      }

      current = this.discoveredTiles.pop()!;
    } while (this.tiles[current.y][current.x]);

    this.tiles[current.y][current.x] = true;
    this.buildPath(current.x, current.y, this.directions[current.y][current.x]);

    if (this.gridModel.getTypeAt(current.x, current.y) == TileType.Exit) return;

    for (const direction of getRandomizedDirections()) {
      const d: Pair = getDirectionValue(direction);
      const invertedDirection: Direction = invertDirection(direction);

      const x: number = current.x + (d.x * 2);
      const y: number = current.y + (d.y * 2);

      if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;

      this.directions[y][x] = invertedDirection;
      this.discoveredTiles.push(new Pair(x, y));
    }
  }

  private buildPath(x: number, y: number, pathDirection: Direction): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    for (const direction of getExtendedDirections()) {
      const d: Pair = getDirectionValue(direction);
      if (direction != pathDirection) {
        if (this.gridModel.getTypeAt(x + d.x, y + d.y) == TileType.Floor) {
          if (this.onstep != null) this.onstep(x + d.x, y + d.y, TileType.Wall);
        }
      } else {
        if (this.gridModel.getTypeAt(x + d.x, y + d.y) == TileType.Wall) {
          if (this.onstep != null) this.onstep(x + d.x, y + d.y, TileType.Floor);
        }
      }
    }
  }

  private buildWall(): void {
    if (this.wall >= Math.max((this.width + 1) / 2, (this.height + 1) / 2)) {
      this.wallBuilt = true;
      return;
    }

    if (this.wall < ((this.width + 1) / 2)) {
      if (this.onstep != null) this.onstep(this.wall, 0, TileType.Wall);
      if (this.onstep != null) this.onstep(this.width - this.wall - 1, 0, TileType.Wall);
      if (this.onstep != null) this.onstep(this.wall, this.height - 1, TileType.Wall);
      if (this.onstep != null) this.onstep(this.width - this.wall - 1, this.height - 1, TileType.Wall);
    }

    if (this.wall < ((this.height + 1) / 2)) {
      if (this.onstep != null) this.onstep(0, this.wall, TileType.Wall);
      if (this.onstep != null) this.onstep(0, this.height - this.wall - 1, TileType.Wall);
      if (this.onstep != null) this.onstep(this.width - 1, this.wall, TileType.Wall);
      if (this.onstep != null) this.onstep(this.width - 1, this.height - this.wall - 1, TileType.Wall);
    }

    this.wall++;
  }
}