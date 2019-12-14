import { Pathfinder } from './Pathfinder';
import { GridModel } from './GridModel';
import { TileState } from './TileState';
import { Queue } from './Queue';
import { Pair, Directions } from './Pair';
import { TileType } from './TileType';

export class BFSPathfinder extends Pathfinder {
  private discoveredTiles: Queue<Pair>;

  constructor(gridModel: GridModel) {
    super(gridModel);
    this.discoveredTiles = new Queue<Pair>();
    this.reset();
  }

  public reset(): void {
    super.reset();
    this.discoveredTiles.clear();
  }

  protected initialization(): void {    
    const x: number = this.gridModel.getExtryTileX();
    const y: number = this.gridModel.getExtryTileY();
    this.discoveredTiles.enqueue(new Pair(x, y));
  }

  protected step(): void {
    if (this.discoveredTiles.isEmpty()) {
      this.running = false;
      return;
    }

    const current: Pair = this.discoveredTiles.dequeue()!;
    this.gridModel.setStateAt(current.x, current.y, TileState.Visited);
    if (this.onstep != null) this.onstep(current.x, current.y);

    for (const d of Directions) {
      if (this.gridModel.getStateAt(current.x + d.x, current.y + d.y) == TileState.Undiscovered) {
        if (this.gridModel.getTileAt(current.x + d.x, current.y + d.y) == TileType.Exit) {
          this.running = false;
          return;
        }

        if (this.gridModel.getTileAt(current.x + d.x, current.y + d.y) == TileType.Floor) {  
          this.gridModel.setStateAt(current.x + d.x, current.y + d.y, TileState.Discovered);
          this.discoveredTiles.enqueue(new Pair(current.x + d.x, current.y + d.y));
          if (this.onstep != null) this.onstep(current.x + d.x, current.y + d.y);
        }
      }
    }
  }
}