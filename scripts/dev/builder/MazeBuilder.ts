import { TileType } from '../utils/TileType';
import { Builder } from './Builder';

export abstract class MazeBuilder extends Builder {
  protected width!: number;
  protected height!: number;
  private wall!: number;
  private wallBuilt!: boolean;
  private wallFilled!: boolean;

  constructor() {
    super();
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
  }

  protected initialization(): void {
    if (this.gridModel == null) {
      return;
    }

    this.wall = 0;
    this.wallBuilt = false;
    this.wallFilled = false;

    if (this.onstep != null) this.onstep(1, 1, TileType.Entry);
    if (this.onstep != null) this.onstep(this.width - 2, this.height - 2, TileType.Exit);
  }

  protected step(): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    if (!this.wallBuilt) this.wallStep();
    else if (!this.wallFilled) this.fillStep();
    else this.mazeStep();
  }

  private wallStep(): void {
    if (this.wall >= Math.max((this.width + 1) / 2, (this.height + 1) / 2)) {
      this.wallBuilt = true;
      this.wall = 1;
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

  private fillStep(): void {
    if (this.wall >= Math.max(this.width, this.height) {
      this.wallFilled = true;
      return;
    }

    const start: number = Math.max(0, this.wall - this.width + 1);
    const end: number = Math.min(this.wall + 1, this.height);
    for (let i = start; i < end; i++) {
      if (this.onstep != null) this.onstep(this.wall - i, i, TileType.Wall);
      if (this.onstep != null) this.onstep(this.width - this.wall + i - 1, this.height - i - 1, TileType.Wall);
    }
    
    this.wall++;
  }

  protected abstract mazeStep(): void;
}