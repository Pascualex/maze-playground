"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridView = /** @class */ (function () {
    function GridView(htmlCanvas, tileSize, gridModel) {
        this.canvas = htmlCanvas.getContext('2d');
        this.tileSize = tileSize;
        this.width = htmlCanvas.width;
        this.height = htmlCanvas.height;
        this.offsetX = Math.floor(((this.width - 1) % (tileSize + 1)) / 2);
        this.offsetY = Math.floor(((this.height - 1) % (tileSize + 1)) / 2);
        this.gridWidth = Math.floor((this.width - 1) / (tileSize + 1));
        this.gridHeight = Math.floor((this.height - 1) / (tileSize + 1));
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
    GridView.prototype.paint = function () {
        if (this.canvas == null)
            return;
        for (var i = 0; i < this.gridModel.getHeight(); i++) {
            for (var j = 0; j < this.gridModel.getWidth(); j++) {
                this.paintTile(j, i);
            }
        }
    };
    GridView.prototype.paintTileAndNeighbours = function (x, y) {
        this.paintTile(x, y);
        this.paintTile(x, y - 1);
        this.paintTile(x + 1, y);
        this.paintTile(x, y + 1);
        this.paintTile(x - 1, y);
    };
    GridView.prototype.paintTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        var tileType = this.gridModel.getTileAt(x, y);
        if (tileType == TileType_1.TileType.Wall) {
            this.canvas.fillStyle = '#0c264a';
            this.canvas.fillRect(xStart, yStart, xSize, ySize);
            this.canvas.fillStyle = '#42eb3f';
            this.printWallDetail(x, y);
        }
        else {
            this.clearTile(x, y);
            this.canvas.fillStyle = '#FFFFFF';
            this.canvas.fillRect(xStart + 1, yStart + 1, xSize - 2, ySize - 2);
        }
    };
    GridView.prototype.clearTile = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        if (this.gridModel.getTileAt(x, y - 1) == TileType_1.TileType.Wall) {
            yStart++;
            ySize--;
        }
        if (this.gridModel.getTileAt(x + 1, y) == TileType_1.TileType.Wall) {
            xSize--;
        }
        if (this.gridModel.getTileAt(x, y + 1) == TileType_1.TileType.Wall) {
            ySize--;
        }
        if (this.gridModel.getTileAt(x - 1, y) == TileType_1.TileType.Wall) {
            xStart++;
            xSize--;
        }
        this.canvas.fillStyle = '#6da6b3';
        this.canvas.fillRect(xStart, yStart, xSize, ySize);
    };
    GridView.prototype.printWallDetail = function (x, y) {
        if (this.canvas == null)
            return;
        if (x < 0 || x >= this.gridWidth)
            return;
        if (y < 0 || y >= this.gridHeight)
            return;
        var xStart = this.tileToCoordinateX(x);
        var yStart = this.tileToCoordinateY(y);
        var xSize = this.tileSize + 2;
        var ySize = this.tileSize + 2;
        var top = (this.gridModel.getTileAt(x, y - 1) == TileType_1.TileType.Wall);
        var right = (this.gridModel.getTileAt(x + 1, y) == TileType_1.TileType.Wall);
        var bottom = (this.gridModel.getTileAt(x, y + 1) == TileType_1.TileType.Wall);
        var left = (this.gridModel.getTileAt(x - 1, y) == TileType_1.TileType.Wall);
        this.canvas.fillStyle = '#3af0c8';
        if (right && left && !top && !bottom) {
            this.canvas.fillRect(xStart, yStart + 15, xSize, ySize - 30);
        }
        else if (top && bottom && !right && !left) {
            this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize);
        }
        else {
            this.canvas.fillRect(xStart + 13, yStart + 13, xSize - 26, ySize - 26);
            if (top)
                this.canvas.fillRect(xStart + 15, yStart, xSize - 30, ySize - 23);
            if (right)
                this.canvas.fillRect(xStart + 23, yStart + 15, xSize - 23, ySize - 30);
            if (bottom)
                this.canvas.fillRect(xStart + 15, yStart + 23, xSize - 30, ySize - 23);
            if (left)
                this.canvas.fillRect(xStart, yStart + 15, xSize - 23, ySize - 30);
        }
    };
    GridView.prototype.tileToCoordinateX = function (x) {
        return this.offsetX + (x * (this.tileSize + 1));
    };
    GridView.prototype.tileToCoordinateY = function (y) {
        return this.offsetY + (y * (this.tileSize + 1));
    };
    GridView.prototype.coordinateXToTile = function (coordinateX) {
        return Math.floor((coordinateX - (this.offsetX + 1)) / (this.tileSize + 1));
    };
    GridView.prototype.coordinateYToTile = function (coordinateY) {
        return Math.floor((coordinateY - (this.offsetY + 1)) / (this.tileSize + 1));
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
            var x = this.coordinateXToTile(event.offsetX);
            var y = this.coordinateYToTile(event.offsetY);
            if (x < 0 || x >= this.gridWidth)
                return;
            if (y < 0 || y >= this.gridHeight)
                return;
            this.ontiletypeselect(x, y);
        }
    };
    GridView.prototype.triggerOnTileClickEvent = function (event) {
        if (this.ontileclick != null) {
            var x = this.coordinateXToTile(event.offsetX);
            var y = this.coordinateYToTile(event.offsetY);
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
