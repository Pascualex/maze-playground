import { Pathfinder } from './Pathfinder';
import { GridModel } from './GridModel';
import { TileType } from './TileType';
import { TileState } from './TileState';
import { Queue } from './Queue';
import { Pair } from './Pair';
import { Direction, getAllDirections, getDirectionValue, invertDirection } from './Direction';
import { LevelBuilder } from './LevelBuilder';

export class LevelBuilderX extends LevelBuilder {
  private direction!: Direction;
  private x!: number;
  private y!: number;

  constructor(gridModel: GridModel) {
    super(gridModel);
    this.reset();
  }

  public reset(): void {
    super.reset();
  }

  protected initialization(): void {
    this.direction = Direction.Right;
    this.x = 0;
    this.y = 0;
  }

  protected step(): void {
    if (this.direction == Direction.Right) {
      if (this.onstep) this.onstep(this.x, this.y, TileType.Wall);
      if (this.x + 1 >= this.gridModel.getWidth()) {
        this.direction = Direction.Down;
        this.y++;
      } else {
        this.x++;
      }
    } else if (this.direction == Direction.Down) {
      if (this.onstep) this.onstep(this.x, this.y, TileType.Wall);
      if (this.y + 1 >= this.gridModel.getHeight()) {
        this.direction = Direction.Left;
        this.x--;
      } else {
        this.y++;
      }
    } else if (this.direction == Direction.Left) {
      if (this.onstep) this.onstep(this.x, this.y, TileType.Wall);
      if (this.x - 1 < 0) {
        this.direction = Direction.Up;
        this.y--;
      } else {
        this.x--;
      }
    } else if (this.direction == Direction.Up) {
      if (this.onstep) this.onstep(this.x, this.y, TileType.Wall);
      if (this.x - 1 >= 0) {
        this.running = false;
        return;
      } else {
        this.y--;
      }
    }
  }
}