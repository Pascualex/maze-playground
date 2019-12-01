"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridCanvas = /** @class */ (function () {
    function GridCanvas(htmlCanvas, tileSize) {
        this.canvas = htmlCanvas.getContext('2d');
        this.tileSize = tileSize;
        this.width = htmlCanvas.width;
        this.height = htmlCanvas.height;
        this.xOffset = Math.floor(this.width % tileSize / 2);
        this.yOffset = Math.floor(this.height % tileSize / 2);
        this.gridHeight = Math.floor(htmlCanvas.width / tileSize);
        this.gridWidth = Math.floor(htmlCanvas.height / tileSize);
    }
    GridCanvas.prototype.paintTile = function (x, y, tileType) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        this.canvas.fillStyle = this.styleForTile(tileType);
        var xStart = this.xOffset + (x * this.tileSize);
        var yStart = this.yOffset + (y * this.tileSize);
        this.canvas.fillRect(xStart, yStart, this.tileSize, this.tileSize);
    };
    GridCanvas.prototype.styleForTile = function (tileType) {
        if (tileType == TileType_1.TileType.Floor) {
            return '#FFFFFF';
        }
        else {
            return '#000000';
        }
    };
    return GridCanvas;
}());
exports.GridCanvas = GridCanvas;
