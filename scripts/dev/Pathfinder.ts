import { GridModel } from './GridModel';
import { TileType } from './TileType';
import { TileState } from './TileState';
import { Direction, getDirectionValue } from './Direction';
import { Pair } from './Pair';

export abstract class Pathfinder {
  protected gridModel: GridModel;
  protected running!: boolean;
  protected exitFound!: boolean;
  protected pathX!: number;
  protected pathY!: number;
  private runningId: number;
  private stepDelay!: number;
  private unactivated!: boolean;
  public onstep!: ((x: number, y: number) => any) | null;

  constructor(gridModel: GridModel) {
    this.gridModel = gridModel;
    this.running = false;
    this.runningId = 0;
    this.stepDelay = 50;
    this.onstep = null;
  }

  public reset(): void {
    this.running = false;
    this.exitFound = false;
    this.stepDelay = 50;
    this.unactivated = true;
  }

  public run(): void {
    if (!this.running) {
      this.unactivated = false;
      this.running = true;
      this.runningId++;
      this.stepLoop(this.runningId);
    }
  }

  public pause(): void {
    this.running = false;
  }

  public isUnactivated(): boolean {
    return this.unactivated;
  }

  protected async stepLoop(runningId: number): Promise<void> {
    this.initialization();
    while (this.running && runningId == this.runningId) {
      if (!this.exitFound) this.step();
      else this.stepPath();
      await this.delay(this.stepDelay);
    }
  };

  protected abstract initialization(): void;
  protected abstract step(): void;

  private stepPath(): void {
    if (this.gridModel.getTypeAt(this.pathX, this.pathY) == TileType.Entry) {
      this.running = false;
      return;
    }

    this.gridModel.setStateAt(this.pathX, this.pathY, TileState.Path);
    const direction: Direction = this.gridModel.getDirectionAt(this.pathX, this.pathY)!;
    if (this.onstep != null) this.onstep(this.pathX, this.pathY);
    const d: Pair = getDirectionValue(direction);
    this.pathX += d.x;
    this.pathY += d.y;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}