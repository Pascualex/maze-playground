import { GridModel } from './GridModel';
import { TileType } from './TileType';

export abstract class LevelBuilder {
  protected gridModel: GridModel;
  protected running: boolean;
  private runningId: number;
  private stepDelay: number;
  private unactivated: boolean;
  public onstep: ((x: number, y: number, tileType: TileType) => any) | null;

  constructor(gridModel: GridModel) {
    this.gridModel = gridModel;
    this.running = false;
    this.runningId = 0;
    this.stepDelay = 50;
    this.unactivated = true;
    this.onstep = null;
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