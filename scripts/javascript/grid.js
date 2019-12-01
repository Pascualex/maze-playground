"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = /** @class */ (function () {
    function Grid(htmlGrid) {
        this.canvas = htmlGrid.getContext('2d');
        this.width = htmlGrid.width;
        this.height = htmlGrid.height;
        this.canvas.fillStyle = "#000000";
        this.canvas.fillRect(0, 0, this.width, this.height);
    }
    return Grid;
}());
exports.Grid = Grid;
