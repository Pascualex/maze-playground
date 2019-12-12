import { GridModel } from './GridModel';

export abstract class Pathfinder {
    protected gridModel: GridModel;
    protected running: boolean;
    private stepDelay: number;
    public onstep: ((x: number, y: number) => any) | null;

    constructor(gridModel: GridModel) {
        this.gridModel = gridModel;
        this.running = false;
        this.stepDelay = 500;
        this.onstep = null;
    }

    public abstract reset(): void;

    public run(): void {
        if (!this.running) {
            this.running = true;
            this.stepLoop();
        }
    }

    public pause(): void {
        this.running = false;
    }

    protected async stepLoop(): Promise<void> {
        while (this.running) {
            await this.delay(this.stepDelay);
            this.step();
        }
    };

    protected abstract step(): void;

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}