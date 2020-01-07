import { TileType } from '../utils/TileType';
import { getRandomizedDirections, getDirectionValue, invertDirection, Direction } from '../utils/Direction';
import { MazeBuilder } from './MazeBuilder';
import { Queue } from '../utils/Queue';
import { Pair } from '../utils/Pair';

export class BFSMazeBuilder extends MazeBuilder {
  private tiles!: boolean[][];
  private directions!: Direction[][];
  private discoveredTiles: Queue<Pair>;
  private currentTile!: Pair | null;

  constructor() {
    super();
    this.discoveredTiles = new Queue<Pair>();
  }

  public reset(): void {
    super.reset();

    if (this.gridModel == null) return;

    this.tiles = new Array<boolean[]>(this.height);
    this.directions = new Array<Direction[]>(this.height);
    for (let i = 0; i < this.height; i++) {
      this.tiles[i] = new Array<boolean>(this.width);
      this.directions[i] = new Array<Direction>(this.width);
    }
  }

  protected initialization(): void {
    super.initialization();

    if (this.gridModel == null) return;

    this.discoveredTiles.clear();
    this.discoveredTiles.enqueue(new Pair(1, 1));
    this.currentTile = null;

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.tiles[i][j] = false;
        this.directions[i][j] = Direction.None;
      }
    }
  }

  protected mazeStep(): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    if (this.currentTile != null) {
      if (this.onstep != null) this.onstep(this.currentTile.x, this.currentTile.y, TileType.Floor);
      this.currentTile = null;
      return;
    }

    let current: Pair;
    do {
      if (this.discoveredTiles.isEmpty()) {
        this.running = false;
        return;
      }

      current = this.discoveredTiles.dequeue()!;
    } while (this.tiles[current.y][current.x]);

    this.tiles[current.y][current.x] = true;
    const d: Pair = getDirectionValue(this.directions[current.y][current.x]);
    if (this.onstep != null) this.onstep(current.x + d.x, current.y + d.y, TileType.Floor);
    if (this.directions[current.y][current.x] != Direction.None) this.currentTile = current;

    if (this.gridModel.getTypeAt(current.x, current.y) == TileType.Exit) return;

    for (const direction of getRandomizedDirections()) {
      const d: Pair = getDirectionValue(direction);
      const invertedDirection: Direction = invertDirection(direction);

      const x: number = current.x + (d.x * 2);
      const y: number = current.y + (d.y * 2);

      if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;

      this.directions[y][x] = invertedDirection;
      this.discoveredTiles.enqueue(new Pair(x, y));
    }
  }
}