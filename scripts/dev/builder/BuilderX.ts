import { Pathfinder } from '../pathfinder/Pathfinder';
import { GridModel } from '../grid/GridModel';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Queue } from '../utils/Queue';
import { Pair } from '../utils/Pair';
import { Direction, getAllDirections, getDirectionValue, invertDirection } from '../utils/Direction';
import { Builder } from './Builder';

export class BuilderX extends Builder {
  private direction!: Direction;
  private x!: number;
  private y!: number;

  constructor() {
    super();
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
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

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