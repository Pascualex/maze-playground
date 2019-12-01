export class Grid {
    private canvas: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(htmlGrid: HTMLCanvasElement) {        
        this.canvas = htmlGrid.getContext('2d')!;
        this.width = htmlGrid.width;
        this.height = htmlGrid.height;
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(0, 0, this.width, this.height);
    }
}