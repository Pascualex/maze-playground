"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, tileSize, gridModel) {
        this.canvas = htmlCanvas.getContext('2d');
        this.tileSize = tileSize;
        this.width = htmlCanvas.width;
        this.height = htmlCanvas.height;
        this.offsetX = Math.floor(this.width % tileSize / 2);
        this.offsetY = Math.floor(this.height % tileSize / 2);
        this.gridHeight = Math.floor(htmlCanvas.width / tileSize);
        this.gridWidth = Math.floor(htmlCanvas.height / tileSize);
        this.gridModel = gridModel;
        this.mousePressed = false;
        this.ontiletypeselect = null;
        this.ontileclick = null;
        this.setupEvents(htmlCanvas);
    }
    GridView.prototype.setupEvents = function (htmlCanvas) {
        var _this = this;
        htmlCanvas.onmousedown = function (event) {
            _this.handleOnMouseDownEvent(event);
        };
        htmlCanvas.onmousemove = function (event) {
            _this.handleOnMouseMoveEvent(event);
        };
        htmlCanvas.onmouseup = function (event) {
            _this.handleOnMouseUpEvent(event);
        };
        htmlCanvas.onmouseleave = function (event) {
            _this.handleOnMouseLeaveEvent(event);
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
        var xStart = this.offsetX + (x * this.tileSize);
        var yStart = this.offsetY + (y * this.tileSize);
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
    GridView.prototype.handleOnMouseDownEvent = function (event) {
        this.mousePressed = true;
        this.triggerOnTileTypeSelectEvent(event);
        this.triggerOnTileClickEvent(event);
    };
    GridView.prototype.handleOnMouseMoveEvent = function (event) {
        if (this.mousePressed) {
            this.triggerOnTileClickEvent(event);
        }
    };
    GridView.prototype.handleOnMouseUpEvent = function (event) {
        this.mousePressed = false;
    };
    GridView.prototype.handleOnMouseLeaveEvent = function (event) {
        this.mousePressed = false;
    };
    GridView.prototype.triggerOnTileTypeSelectEvent = function (event) {
        if (this.ontiletypeselect != null) {
            var x = Math.floor((event.offsetX - this.offsetX) / this.tileSize);
            var y = Math.floor((event.offsetY - this.offsetY) / this.tileSize);
            if (x < 0 || x >= this.gridWidth)
                return;
            if (y < 0 || y >= this.gridHeight)
                return;
            this.ontiletypeselect(x, y);
        }
    };
    GridView.prototype.triggerOnTileClickEvent = function (event) {
        if (this.ontileclick != null) {
            var x = Math.floor((event.offsetX - this.offsetX) / this.tileSize);
            var y = Math.floor((event.offsetY - this.offsetY) / this.tileSize);
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
