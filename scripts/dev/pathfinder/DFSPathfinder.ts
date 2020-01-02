import { Pathfinder } from './Pathfinder';
import { GridModel } from '../grid/GridModel';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Stack } from '../utils/Stack';
import { Pair } from '../utils/Pair';
import { Direction, getDirectionValue, invertDirection, getRandomizedDirections } from '../utils/Direction';

export class DFSPathfinder extends Pathfinder {
  private discoveredTiles: Stack<Pair>;

  constructor() {
    super();
    this.discoveredTiles = new Stack<Pair>();
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
    this.discoveredTiles.push(new Pair(x, y));
  }

  protected step(): void {
    if (this.gridModel == null || this.discoveredTiles.isEmpty()) {
      this.running = false;
      return;
    }

    const current: Pair = this.discoveredTiles.pop()!;
    if (this.onstep != null) this.onstep(current.x, current.y, TileState.Visited, null);

    for (const direction of getRandomizedDirections()) {
      const d: Pair = getDirectionValue(direction);
      if (this.gridModel.getStateAt(current.x + d.x, current.y + d.y) == TileState.Undiscovered) {
        if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType.Exit) {
          const invertedDirection: Direction = invertDirection(direction);
          this.exitFound = true;
          this.pathX = current.x + d.x;
          this.pathY = current.y + d.y;
          if (this.onstep != null) this.onstep(current.x + d.x, current.y + d.y, TileState.Visited, invertedDirection);
          return;
        }

        if (this.gridModel.getTypeAt(current.x + d.x, current.y + d.y) == TileType.Floor) {  
          const invertedDirection: Direction = invertDirection(direction);
          this.discoveredTiles.push(new Pair(current.x + d.x, current.y + d.y));
          if (this.onstep != null) this.onstep(current.x + d.x, current.y + d.y, TileState.Discovered, invertedDirection);
        }
      }
    }
  }
}