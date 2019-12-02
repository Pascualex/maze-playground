(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./GridModel":2,"./GridView":3,"./TileType":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType_1 = require("./TileType");
var GridModel = /** @class */ (function () {
    function GridModel(width, height) {
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
    GridModel.prototype.getTileAt = function (x, y) {
        if (x < 0 || x >= this.width)
            return null;
        if (y < 0 || y >= this.height)
            return null;
        return this.tiles[y][x];
    };
    GridModel.prototype.setTileAt = function (x, y, tileType) {
        if (x < 0 || x >= this.width)
            return;
        if (y < 0 || y >= this.height)
            return;
        this.tiles[y][x] = tileType;
    };
    GridModel.prototype.getWidth = function () {
        return this.width;
    };
    GridModel.prototype.getHeight = function () {
        return this.height;
    };
    return GridModel;
}());
exports.GridModel = GridModel;

},{"./TileType":4}],3:[function(require,module,exports){
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
