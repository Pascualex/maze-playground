"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, tileSize, gridModel) {
        this.canvas = htmlCanvas.getContext('2d');
        this.tileSize = tileSize;
        this.width = htmlCanvas.width;
        this.height = htmlCanvas.height;
        this.xOffset = Math.floor(this.width % tileSize / 2);
        this.yOffset = Math.floor(this.height % tileSize / 2);
        this.gridHeight = Math.floor(htmlCanvas.width / tileSize);
        this.gridWidth = Math.floor(htmlCanvas.height / tileSize);
        this.gridModel = gridModel;
        this.ontileclick = null;
        this.setupEvents(htmlCanvas);
    }
    GridView.prototype.setupEvents = function (htmlCanvas) {
        var _this = this;
        htmlCanvas.onclick = function (event) {
            _this.manageOnClickEvent(event);
        };
    };
    GridView.prototype.paintTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var tileType = this.gridModel.getTileAt(x, y);
        this.canvas.fillStyle = this.styleForTile(tileType);
        var xStart = this.xOffset + (x * this.tileSize);
        var yStart = this.yOffset + (y * this.tileSize);
        this.canvas.fillRect(xStart, yStart, this.tileSize, this.tileSize);
    };
    GridView.prototype.styleForTile = function (tileType) {
        if (tileType == TileType_1.TileType.Floor) {
            return '#FFFFFF';
        }
        else {
            return '#000000';
        }
    };
    GridView.prototype.manageOnClickEvent = function (event) {
        //console.log('GridCanvas click event in (' + event.clientX + ', ' + event.clientY + ')');
        if (this.ontileclick != null) {
            var x = Math.floor((event.clientX - this.xOffset) / this.tileSize);
            var y = Math.floor((event.clientY - this.yOffset) / this.tileSize);
            if (x < 0 || x >= this.gridWidth)
                return;
            if (y < 0 || y >= this.gridHeight)
                return;
            this.ontileclick(x, y);
        }
    };
    return GridView;
}());
exports.GridView = GridView;
