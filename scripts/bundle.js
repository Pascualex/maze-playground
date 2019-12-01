(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./GridCanvas":2,"./GridData":3,"./TileType":4}],2:[function(require,module,exports){
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

},{"./TileType":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridData = /** @class */ (function () {
    function GridData(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Array(height);
        for (var i = 0; i < height; i++) {
            this.tiles[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                this.tiles[i][j] = TileType_1.TileType.Floor;
            }
        }
    }
    GridData.prototype.getTileAt = function (x, y) {
        return this.tiles[y][x];
    };
    GridData.prototype.setTileAt = function (x, y, tileType) {
        this.tiles[y][x] = tileType;
    };
    GridData.prototype.getWidth = function () {
        return this.width;
    };
    GridData.prototype.getHeight = function () {
        return this.height;
    };
    return GridData;
}());
exports.GridData = GridData;

},{"./TileType":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType;
(function (TileType) {
    TileType[TileType["Floor"] = 0] = "Floor";
    TileType[TileType["Wall"] = 1] = "Wall";
})(TileType = exports.TileType || (exports.TileType = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grid_1 = require("./Grid");
var grid;
window.onload = function () {
    var htmlGrid = document.getElementById("grid");
    if (htmlGrid != null && htmlGrid instanceof HTMLCanvasElement) {
        grid = new Grid_1.Grid(htmlGrid, 16);
    }
};

},{"./Grid":1}]},{},[5]);
