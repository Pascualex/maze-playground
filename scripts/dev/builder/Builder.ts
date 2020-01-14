import { GridModel } from '../grid/GridModel';
import { TileType } from '../utils/TileType';

export abstract class Builder {
  protected gridModel: GridModel | null;
  protected running: boolean;
  private runningId: number;
  private stepDelay: number;
  private unactivated: boolean;
  public onstep: ((x: number, y: number, tileType: TileType) => any) | null;

  constructor() {
    this.gridModel = null;
    this.running = false;
    this.runningId = 0;
    this.stepDelay = 50;
    this.unactivated = true;
    this.onstep = null;
  }

  public setGridModel(gridModel: GridModel): void {
    this.gridModel = gridModel;
    this.reset();
  }

  public setStepDelay(stepDelay: number): void {
    this.stepDelay = stepDelay;
  }

  public reset(): void {
    this.running = false;
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
      this.step();
      await this.delay(this.stepDelay);
    }
  };

  protected abstract initialization(): void;
  protected abstract step(): void;

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}