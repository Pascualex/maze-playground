"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridModel_1 = require("./GridModel");
var GridView_1 = require("./GridView");
var TileType_1 = require("./TileType");
var Grid = /** @class */ (function () {
    function Grid(htmlCanvas, tileSize) {
        var gridHeight = Math.floor(htmlCanvas.width / tileSize);
        var gridWidth = Math.floor(htmlCanvas.height / tileSize);
        this.gridModel = new GridModel_1.GridModel(gridHeight, gridWidth);
        this.gridView = new GridView_1.GridView(htmlCanvas, tileSize, this.gridModel);
        this.setupEvents();
        this.paint();
    }
    Grid.prototype.setupEvents = function () {
        var _this = this;
        this.gridView.ontileclick = function (x, y) {
            _this.manageOnTileClickEvent(x, y);
        };
    };
    Grid.prototype.manageOnTileClickEvent = function (x, y) {
        this.gridModel.setTileAt(x, y, TileType_1.TileType.Wall);
        this.gridView.paintTile(x, y);
    };
    Grid.prototype.paint = function () {
        for (var i = 0; i < this.gridModel.getHeight(); i++) {
            for (var j = 0; j < this.gridModel.getWidth(); j++) {
                this.gridView.paintTile(j, i);
            }
        }
    };
    return Grid;
}());
exports.Grid = Grid;
