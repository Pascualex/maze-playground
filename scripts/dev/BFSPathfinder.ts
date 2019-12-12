import { Pathfinder } from './Pathfinder';
import { GridModel } from './GridModel';
import { TileState } from './TileState';

export class BFSPathfinder extends Pathfinder {
    private x: number;

    constructor(gridModel: GridModel) {
        super(gridModel);
        this.x = 0;
    }

    public reset(): void {

    }

    public pause(): void {

    }

    protected step(): void {
        this.gridModel.setStateAt(this.x, 0, TileState.Visited);

        if (this.onstep != null) {
            this.onstep(this.x, 0);
        }

        this.x++;
        if (this.x >= this.gridModel.getWidth()) {
            this.running = false;
        }
    }
}