import { GridModel } from '../grid/GridModel';
import { TileType } from '../utils/TileType';
import { TileState } from '../utils/TileState';
import { Direction, getDirectionValue } from '../utils/Direction';
import { Pair } from '../utils/Pair';

export abstract class Pathfinder {
  protected gridModel: GridModel | null;
  protected running: boolean;
  protected exitFound: boolean;
  protected pathX!: number;
  protected pathY!: number;
  private runningId: number;
  private stepDelay: number;
  private unactivated: boolean;
  public onstep: ((x: number, y: number, tileState: TileState, direction: Direction | null) => any) | null;
  public onpathstep: ((x: number, y: number, tileState: TileState, direction: Direction | null) => any) | null;

  constructor() {
    this.gridModel = null;
    this.running = false;
    this.exitFound = false;
    this.runningId = 0;
    this.stepDelay = 50;
    this.unactivated = true;
    this.onstep = null;
    this.onpathstep = null;
  }

  public setGridModel(gridModel: GridModel): void {
    this.gridModel = gridModel;
  }

  public reset(): void {
    this.running = false;
    this.exitFound = false;
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
      else this.pathStep();
      await this.delay(this.stepDelay);
    }
  };

  protected abstract initialization(): void;
  protected abstract step(): void;

  private pathStep(): void {
    if (this.gridModel == null) {
      this.running = false;
      return;
    }

    if (this.onpathstep != null) this.onpathstep(this.pathX, this.pathY, TileState.Path, null);

    if (this.gridModel.getTypeAt(this.pathX, this.pathY) == TileType.Entry) {
      this.running = false;
      return;
    }

    const direction: Direction = this.gridModel.getDirectionAt(this.pathX, this.pathY)!;
    const d: Pair = getDirectionValue(direction);
    this.pathX += d.x;
    this.pathY += d.y;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}