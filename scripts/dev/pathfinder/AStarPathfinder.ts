import { Pathfinder } from './Pathfinder';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Heap } from '../utils/Heap';
import { Pair } from '../utils/Pair';
import { Direction, getDirections, getDirectionValue, invertDirection } from '../utils/Direction';

export class AStarPathfinder extends Pathfinder {
  private discoveredTiles: Heap<AStarTile>;

  constructor() {
    super();
    this.discoveredTiles = new Heap<AStarTile>();
  }

  public reset(): void {
    super.reset();
    this.discoveredTiles.clear();
  }

  protected initialization(): void {    
    if (this.gridModel == null) return;
    const xEntry: number = this.gridModel.getEntryTileX();
    const yEntry: number = this.gridModel.getEntryTileY();
    const xExit: number = this.gridModel.getExitTileX();
    const yExit: number = this.gridModel.getExitTileY();
    const distance: number = this.calculateDistance(xEntry, yEntry, xExit, yExit);
    this.discoveredTiles.push(new AStarTile(xEntry, yEntry, 0, distance));
  }

  protected step(): void {
    if (this.gridModel == null || this.discoveredTiles.isEmpty()) {
      this.running = false;
      return;
    }

    const current: AStarTile = this.discoveredTiles.pop()!;
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
          const xExit: number = this.gridModel.getExitTileX();
          const yExit: number = this.gridModel.getExitTileY();
          const distance: number = this.calculateDistance(current.x + d.x, current.y + d.y, xExit, yExit);
          this.discoveredTiles.push(new AStarTile(current.x + d.x, current.y + d.y, current.gScore + 1, distance));
          if (this.onstep != null) {
            this.onstep(current.x + d.x, current.y + d.y, TileState.Discovered, invertedDirection);
          }
        }
      }
    }
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
}

class AStarTile extends Pair {
  public gScore: number;
  public fScore: number;

  constructor(x: number, y: number, gScore: number, fScore: number) {
    super(x, y);
    this.gScore = gScore;
    this.fScore = fScore;
  }
  
  public compare(other: AStarTile): number {
    if ((this.gScore + this.fScore) != (other.gScore + other.fScore)) {
      return (this.gScore + this.fScore) - (other.gScore + other.fScore);
    } else {
      return this.fScore - other.fScore;
    }
  }
}