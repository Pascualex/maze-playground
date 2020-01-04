import { Pathfinder } from './Pathfinder';
import { GridModel } from '../grid/GridModel';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Queue } from '../utils/Queue';
import { Pair } from '../utils/Pair';
import { Direction, getDirections, getDirectionValue, invertDirection } from '../utils/Direction';

export class BFSPathfinder extends Pathfinder {
  private discoveredTiles: Queue<Pair | null>;

  constructor() {
    super();
    this.discoveredTiles = new Queue<Pair | null>();
    this.reset();
  }

  public reset(): void {
    super.reset();
    this.discoveredTiles.clear();
  }

  protected initialization(): void {    
    if (this.gridModel == null) return;
    const x: number = this.gridModel.getEntryTileX();
    const y: number = this.gridModel.getEntryTileY();
    this.discoveredTiles.enqueue(new Pair(x, y));
    this.discoveredTiles.enqueue(null);
  }

  protected step(): void {
    if (this.gridModel == null || this.discoveredTiles.size() <= 1) {
      this.running = false;
      return;
    }

    let current: Pair | null = this.discoveredTiles.dequeue();
    if (current == null) {
      this.discoveredTiles.shuffle();
      this.discoveredTiles.enqueue(null);
      current = this.discoveredTiles.dequeue()!;
    }

    if (this.onstep != null) this.onstep(current.x, current.y, TileState.Visited, null);

    for (const direction of getDirections()) {
      const d: Pair = getDirectionValue(direction);
      if (this.gridModel.getStateAt(current.x + d.x, current.y + d.y) == TileState.Undiscovered) {
        if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType.Exit) {
          const invertedDirection: Direction = invertDirection(direction);
          this.exitFound = true;
          this.pathX = current.x + d.x;
          this.pathY = current.y + d.y;
          if (this.onstep != null) {
            this.onstep(current.x + d.x, current.y + d.y, TileState.Discovered, invertedDirection);
          }
        }

        if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType.Floor) {  
          const invertedDirection: Direction = invertDirection(direction);
          this.discoveredTiles.enqueue(new Pair(current.x + d.x, current.y + d.y));
          if (this.onstep != null) {
            this.onstep(current.x + d.x, current.y + d.y, TileState.Discovered, invertedDirection);
          }
        }
      }
    }
  }
}