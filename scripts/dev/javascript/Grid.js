"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridData_1 = require("./GridData");
var GridCanvas_1 = require("./GridCanvas");
var TileType_1 = require("./TileType");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas, tileSize) {
        var gridHeight = Math.floor(htmlCanvas.width / tileSize);
        var gridWidth = Math.floor(htmlCanvas.height / tileSize);
        this.gridData = new GridData_1.GridData(gridHeight, gridWidth);
        this.gridCanvas = new GridCanvas_1.GridCanvas(htmlCanvas, tileSize);
        // Only as a test
        for (var i = 0; i <= 5; i++) {
            this.gridData.setTileAt(3, 5 + i, TileType_1.TileType.Wall);
        }
        this.paint();
    }
    Grid.prototype.paint = function () {
        for (var i = 0; i < this.gridData.getHeight(); i++) {
            for (var j = 0; j < this.gridData.getWidth(); j++) {
                var tileType = this.gridData.getTileAt(j, i);
                this.gridCanvas.paintTile(j, i, tileType);
            }
        }
    };
    return Grid;
}());
exports.Grid = Grid;
