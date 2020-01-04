import { Builder } from './Builder';
import { TileType } from '../utils/TileType';

export class ForestBuilder extends Builder {

  constructor() {
    super();
  }

  public reset(): void {
    super.reset();
  }

  protected initialization(): void {
    if (this.gridModel == null) return;

    const width: number = this.gridModel.getWidth();
    const height: number = this.gridModel.getHeight();

    if (this.onstep != null) this.onstep(0, 0, TileType.Entry);
    if (this.onstep != null) this.onstep(width - 1, height - 1, TileType.Exit);
  }

  protected step(): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    this.running = false;
  }
}